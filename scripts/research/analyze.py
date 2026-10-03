"""Rank education keyword opportunities from Keyword Planner pulls."""
import re, json, math, sys
import pandas as pd

GEOS = ["WORLD", "US", "IN"]
BRANDS = r"\b(chegg|khan academy|khanacademy|coursera|udemy|byju|byjus|quizlet|duolingo|kumon|brainly|photomath|mathway|symbolab|course hero|coursehero|edx|udacity|skillshare|pluralsight|linkedin learning|canvas|moodle|blackboard|google classroom|schoology|kahoot|quizizz|gimkit|blooket|ixl|prodigy|abcmouse|outschool|varsity tutors|wyzant|preply|tutor\.com|cambly|italki|babbel|rosetta|magoosh|kaplan|princeton review|unacademy|vedantu|physics wallah|pw|aakash|allen|testbook|adda247|gradeup|embibe|toppr|doubtnut|socratic|grammarly|turnitin|gauth|gauthmath|quillbot|studocu|scribd|knowunity|anki|notion|remnote|obsidian|k12|k5|time4learning|abeka|sylvan|mathnasium|great learning|simplilearn|upgrad|scaler|codecademy|freecodecamp|datacamp|w3schools|geeksforgeeks|leetcode|brilliant|masterclass|teachable|thinkific|kajabi|powerschool|infinite campus|skyward|classdojo|seesaw|nearpod|pear deck|edpuzzle|flipgrid|padlet|wgu|snhu|phoenix|liberty university|harvard|mit|stanford|ignou|nptel|swayam|byju's|cuemath|whitehat|leadsquared|teachmint|classplus|zoom|teams|chatgpt|gpt|gemini|copilot|claude|perplexity|sora|khanmigo|magicschool|brisk|diffit|curipod|eduaide|twee|gradescope|turn it in|zipgrade|formative|socrative|edmodo|cengage|pearson|mcgraw|savvas|wiley|abc mouse|starfall|reading eggs|epic|hooked on phonics|all about reading|lexia|raz kids|newsela|commonlit|readworks|study\.com|sparknotes|cliffsnotes|litcharts|shmoop|bartleby|numerade|slader|toppr|vidyakul|meritnation|extramarks|leverage edu|shiksha|collegedunia|careers360|indeed|linkedin|naukri|teachers pay teachers|tpt|pinterest|youtube|tiktok|reddit)\b"
CATS = [
    ("edu_tools_ai", r"\b(ai|artificial intelligence|chatgpt|gpt)\b.*\b(lesson|grad|quiz|teacher|tutor|homework|study|essay|worksheet|rubric|feedback|assess|question|flashcard|note|summar|detector|school|class|learn)|(lesson|grad|quiz|teacher|tutor|homework|study|essay|worksheet|rubric|feedback|assess|question|flashcard|note|summar|detector|school|class|learn).*\b(ai|artificial intelligence|chatgpt|gpt)\b"),
    ("test_prep", r"\b(sat|act|gre|gmat|lsat|mcat|ielts|toefl|pte|duolingo english|jee|neet|upsc|cat|gate|ssc|bank po|ibps|rrb|cuet|clat|bar exam|nclex|cfa|cpa|pmp|aws|azure|ccna|comptia|security\+|ap exam|ap )\b.*|.*\b(prep|preparation|mock test|practice test|past paper|question paper|previous year|entrance|admission test|exam)\b"),
    ("tutoring", r"\b(tutor|tutoring|tuition|coaching|home teacher)\b"),
    ("homework_solver", r"\b(homework|solver|solve|answers?|step by step|math help|equation|calculator)\b"),
    ("study_tools", r"\b(flashcard|flash card|study|notes?|note taking|revision|memoriz|mind map|summar|pomodoro|planner)\b"),
    ("teacher_tools", r"\b(lms|learning management|school management|lesson plan|grading|grader|grade book|gradebook|quiz maker|quiz generator|worksheet|rubric|classroom|plagiarism|detector|student information|proctor|exam software|attendance|timetable|erp|report card|behavior|seating)\b"),
    ("k12_kids", r"\b(kids?|children|child|toddler|preschool|kindergarten|grade \d|\dth grade|elementary|middle school|high school|homeschool|home school|phonics|learn to read|reading program|summer school|after school|montessori|abacus)\b"),
    ("coding_data_ai_skills", r"\b(python|java|javascript|sql|coding|programming|bootcamp|data science|machine learning|deep learning|ai course|learn ai|prompt engineering|cybersecurity|cloud|devops|web development|full stack|excel|power bi|tableau)\b"),
    ("language_learning", r"\b(english|spanish|french|german|japanese|korean|chinese|mandarin|hindi|arabic|language|speaking|grammar|vocabulary|pronunciation|spoken)\b"),
    ("degrees_higher_ed", r"\b(degree|mba|bachelor|master|masters|phd|university|college|nursing|diploma|graduate|undergraduate|scholarship|admission)\b"),
    ("courses_certs", r"\b(course|courses|certificate|certification|training|class|classes|workshop|webinar|skill)\b"),
    ("teacher_careers", r"\b(teacher job|teaching job|teach|teacher|tefl|tesol|substitute|lecturer|faculty)\b"),
    ("special_needs", r"\b(special education|special needs|dyslexia|dyscalculia|adhd|autism|speech therapy|iep|occupational therapy|learning disabilit)\b"),
]

def cat(kw):
    for name, rx in CATS:
        if re.search(rx, kw):
            return name
    return "other"

def load(geo):
    df = pd.read_csv(f"out/ideas-{geo}.csv")
    df["geo"] = geo
    return df

frames = [load(g) for g in GEOS]
df = pd.concat(frames, ignore_index=True)
df["brand"] = df.keyword.str.contains(BRANDS, regex=True)
df["ai"] = df.keyword.str.contains(r"\b(ai|artificial intelligence|chatgpt|gpt)\b", regex=True)
df["cat"] = df.keyword.map(cat)
df["growth"] = df.growth_3m_vs_3m.fillna(0).clip(-0.9, 3)
# opportunity: volume-weighted, penalise ad competition, reward growth; log scale keeps giants from dominating
df["opp"] = df.avg_monthly_searches.map(lambda v: math.log10(v + 1)) * (1 - df.competition_index / 100 * 0.7) * (1 + df.growth)
df.to_csv("out/all-classified.csv", index=False)

nb = df[~df.brand]
for geo in GEOS:
    g = nb[nb.geo == geo]
    roll = g.groupby("cat").agg(keywords=("keyword", "count"), total_vol=("avg_monthly_searches", "sum"),
                                med_comp=("competition_index", "median"), med_growth=("growth", "median"),
                                ai_share=("ai", "mean")).sort_values("total_vol", ascending=False)
    roll["ai_share"] = (roll.ai_share * 100).round(0)
    print(f"\n=== {geo}: category rollup (non-brand) ===")
    print(roll.to_string())

print("\n=== WORLD top 60 non-brand by volume ===")
w = nb[nb.geo == "WORLD"].sort_values("avg_monthly_searches", ascending=False)
print(w.head(60)[["keyword", "cat", "avg_monthly_searches", "competition_index", "growth", "high_top_bid"]].to_string(index=False))

print("\n=== WORLD top 60 non-brand by opportunity (vol x low-comp x growth), vol>=5000 ===")
print(w[w.avg_monthly_searches >= 5000].sort_values("opp", ascending=False).head(60)[["keyword", "cat", "avg_monthly_searches", "competition_index", "growth", "high_top_bid"]].to_string(index=False))

print("\n=== WORLD AI-flavoured non-brand, top 50 by volume ===")
print(w[w.ai].head(50)[["keyword", "cat", "avg_monthly_searches", "competition_index", "growth"]].to_string(index=False))

print("\n=== WORLD fastest growing, vol>=10000, top 40 ===")
print(w[w.avg_monthly_searches >= 10000].sort_values("growth", ascending=False).head(40)[["keyword", "cat", "avg_monthly_searches", "competition_index", "growth"]].to_string(index=False))

print("\n=== BRAND demand (WORLD), top 30 ===")
print(df[(df.geo == "WORLD") & df.brand].sort_values("avg_monthly_searches", ascending=False).head(30)[["keyword", "avg_monthly_searches", "growth"]].to_string(index=False))
