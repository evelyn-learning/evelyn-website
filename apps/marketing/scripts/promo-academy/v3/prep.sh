#!/bin/zsh
# Academy tour v3 — level-match the narration. Run from the work dir after gen-vo.mjs.
set -e
norm() { # one linear gain per line, so a line's own dynamics are untouched
  local I=$(ffmpeg -hide_banner -nostats -i "$1" -af ebur128 -f null - 2>&1 | awk '/I:/{v=$2} END{print v}')
  local G=$(python3 -c "print(round(${3:--18} - ($I), 2))")
  ffmpeg -y -v error -i "$1" -af "volume=${G}dB,alimiter=limit=0.89" -ar 48000 -ac 2 "$2"; echo "norm $(basename $1): $I LUFS → gain ${G} dB"
}
mkdir -p vo/norm; for f in vo/raw/*.mp3; do norm $f vo/norm/$(basename $f .mp3).wav; done

# 2. Tutor slice — four real moments of the Pythagoras capture (CAPTURE_ZOOM=1.5, Coach Riley),
#    joined by dissolves so the board changes under every sentence: triangle draws →
#    "right angle" is handwritten at B → the theorem lands → the worked 3-4-5 line lands.
#    Each moment gets a slow push-in anchored top-left (z ≥ 1.09), which also crops the
#    session's speech ticker: the picture is cut to the BOARD events, not to when the
#    sentence was really spoken, so the ticker would contradict the audio.
#    Sentences #4, #9, #17 are the sidecar PCM, each level-matched on its own.
D=session/pyth/raw/geometry; T=$D/geometry.tts; V=$D/geometry.webm
for n in 004 009 017; do ffmpeg -y -v error -f f32le -ar 24000 -ac 1 -i $T/$n.f32 session/p$n-raw.wav; norm session/p$n-raw.wav session/p$n.wav; done
ffmpeg -y -v error -i session/p004.wav -i session/p009.wav -i session/p017.wav -filter_complex \
  "[0:a]adelay=1700|1700[a0];[1:a]adelay=6800|6800[a1];[2:a]adelay=13200|13200[a2];[a0][a1][a2]amix=inputs=3:normalize=0,apad=whole_dur=21.5[o]" \
  -map "[o]" -t 21.5 session/tutor-pyth.wav
seg() { echo "fps=30,setpts=PTS-STARTPTS,scale=3840:2160:flags=lanczos,zoompan=z='$2+($3-$2)*on/($1*30)':x=0:y=0:d=1:s=1920x1080:fps=30"; }
ffmpeg -y -v error -ss 30.3 -t 3.7 -i $V -ss 43.0 -t 3.8 -i $V -ss 59.6 -t 6.4 -i $V -ss 133.6 -t 9.1 -i $V -i session/tutor-pyth.wav -filter_complex \
 "[0:v]$(seg 3.7 1.09 1.12)[p1];[1:v]$(seg 3.8 1.12 1.15)[p2];[2:v]$(seg 6.4 1.09 1.15)[p3];[3:v]$(seg 9.1 1.09 1.16)[p4];\
  [p1][p2]xfade=transition=fade:duration=0.5:offset=3.2[x1];[x1][p3]xfade=transition=fade:duration=0.5:offset=6.5[x2];[x2][p4]xfade=transition=fade:duration=0.5:offset=12.4[v]" \
 -map "[v]" -map 4:a -c:v libx264 -crf 14 -preset veryfast -r 30 -c:a pcm_s16le -t 21.5 session/live-slice-pyth.mkv
