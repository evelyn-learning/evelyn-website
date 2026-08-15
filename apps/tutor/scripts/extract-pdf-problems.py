#!/usr/bin/env python3
"""
Extract problems from College Physics for AP Courses 2e PDF
"""

import sys
import re
import json
from pathlib import Path
from PyPDF2 import PdfReader

def extract_text_from_pages(reader, start_page: int, end_page: int) -> str:
    """Extract text from a range of pages."""
    text = ""
    for i in range(start_page - 1, min(end_page, len(reader.pages))):
        page = reader.pages[i]
        page_text = page.extract_text()
        text += f"\n\n--- PAGE {i + 1} ---\n\n{page_text}"
    return text

def find_problems_pages(reader, chapter_start: int, chapter_end: int) -> tuple[int, int]:
    """Find the Problems & Exercises section within a chapter."""
    problems_start = None
    problems_end = chapter_end

    for page_num in range(chapter_start - 1, min(chapter_end, len(reader.pages))):
        text = reader.pages[page_num].extract_text()

        # Look for Problems & Exercises section
        if problems_start is None:
            if "PROBLEMS" in text.upper() or "Problems & Exercises" in text:
                problems_start = page_num + 1
                print(f"  Found Problems section at page {problems_start}")

        # Look for next chapter start (end of problems)
        if problems_start is not None:
            if "CHAPTER" in text and str(int(text.split("CHAPTER")[1][:3].strip())) != "":
                try:
                    next_ch = int(re.search(r'CHAPTER\s*(\d+)', text).group(1))
                    if next_ch > 0:
                        problems_end = page_num
                        print(f"  Found next chapter at page {problems_end}")
                        break
                except:
                    pass

    return problems_start or chapter_start, problems_end

def clean_problem_text(text: str) -> str:
    """Clean up extracted PDF text."""
    # Remove page markers
    text = re.sub(r'--- PAGE \d+ ---', '', text)

    # Fix common PDF extraction issues
    text = re.sub(r'(\w)- \n(\w)', r'\1\2', text)  # Fix hyphenation
    text = re.sub(r'\n+', '\n', text)  # Multiple newlines
    text = re.sub(r' +', ' ', text)  # Multiple spaces

    return text.strip()

def main():
    pdf_path = "/Users/luke/Downloads/College_Physics_for_AP_Courses_2e-WEB_DkhNbxV.pdf"
    output_dir = Path("/Users/luke/Dev/evelynlearning/src/lib/knowledge/extracted")
    output_dir.mkdir(exist_ok=True)

    print(f"Reading PDF: {pdf_path}")
    reader = PdfReader(pdf_path)
    print(f"Total pages: {len(reader.pages)}")

    # Based on our search, the chapters are at:
    chapters = {
        'kinematics': {
            'name': 'Kinematics (Chapter 2)',
            'chapter_start': 60,  # Section 2.1 starts around page 66
            'chapter_end': 130,   # Chapter 3 starts around here
        },
        'fluids': {
            'name': 'Fluid Statics (Chapter 11)',
            'chapter_start': 485,  # Section 11.1 starts around page 487
            'chapter_end': 550,    # Chapter 12 starts around here
        }
    }

    for chapter_key, chapter_info in chapters.items():
        print(f"\n{'='*60}")
        print(f"Extracting: {chapter_info['name']}")
        print(f"{'='*60}")

        # Find problems section within chapter
        problems_start, problems_end = find_problems_pages(
            reader,
            chapter_info['chapter_start'],
            chapter_info['chapter_end']
        )

        print(f"Extracting pages {problems_start} to {problems_end}...")

        # Extract the full chapter for context, but focus on problems
        full_text = extract_text_from_pages(reader, chapter_info['chapter_start'], chapter_info['chapter_end'])
        problems_text = extract_text_from_pages(reader, problems_start, problems_end)

        # Clean up
        full_text = clean_problem_text(full_text)
        problems_text = clean_problem_text(problems_text)

        print(f"Extracted {len(problems_text)} characters of problems")

        # Save outputs
        raw_output = output_dir / f"pdf-{chapter_key}-chapter.txt"
        with open(raw_output, 'w') as f:
            f.write(full_text)
        print(f"Saved chapter text to: {raw_output}")

        problems_output = output_dir / f"pdf-{chapter_key}-problems.txt"
        with open(problems_output, 'w') as f:
            f.write(problems_text)
        print(f"Saved problems text to: {problems_output}")

        # Extract individual problems using regex
        print("\nLooking for numbered problems...")
        # Pattern: number followed by period and text
        problem_pattern = r'(\d{1,3})\.\s+([A-Z][^.?!]*(?:[.?!][^.?!]*){0,10}[.?!])'
        matches = re.findall(problem_pattern, problems_text)

        if matches:
            print(f"Found {len(matches)} potential problems")
            # Show first few
            for i, (num, text) in enumerate(matches[:5]):
                preview = text[:100].replace('\n', ' ')
                print(f"  Problem {num}: {preview}...")
        else:
            print("No numbered problems found with standard pattern")

        # Print preview
        print(f"\nProblems section preview (first 2000 chars):")
        print("-" * 40)
        print(problems_text[:2000])
        print("-" * 40)

if __name__ == "__main__":
    main()
