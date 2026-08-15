#!/usr/bin/env python3
"""
Find chapter locations in College Physics for AP Courses 2e PDF
"""

import re
from PyPDF2 import PdfReader

pdf_path = "/Users/luke/Downloads/College_Physics_for_AP_Courses_2e-WEB_DkhNbxV.pdf"

print(f"Reading PDF: {pdf_path}")
reader = PdfReader(pdf_path)
print(f"Total pages: {len(reader.pages)}")

# Search terms for each chapter
search_terms = [
    ("kinematics", ["CHAPTER 2", "Kinematics", "2.1 Displacement"]),
    ("fluids", ["CHAPTER 11", "Fluid Statics", "11.1 What Is a Fluid"]),
    ("problems", ["PROBLEMS", "Problems & Exercises", "Conceptual Questions"]),
]

print("\nSearching for chapter markers...")
print("="*60)

# Sample every 10 pages to find general location
for page_num in range(0, len(reader.pages), 20):
    try:
        text = reader.pages[page_num].extract_text()[:500]

        # Check for chapter markers
        if "CHAPTER 2" in text.upper() or "KINEMATICS" in text.upper():
            print(f"Page {page_num + 1}: Found potential Kinematics chapter")
            print(f"  Preview: {text[:150]}...")

        if "CHAPTER 11" in text.upper() or "FLUID STATICS" in text.upper():
            print(f"Page {page_num + 1}: Found potential Fluids chapter")
            print(f"  Preview: {text[:150]}...")

        if "CHAPTER 12" in text.upper() or "FLUID DYNAMICS" in text.upper():
            print(f"Page {page_num + 1}: Found potential Fluid Dynamics chapter")
            print(f"  Preview: {text[:150]}...")

    except Exception as e:
        pass

# Also search first 30 pages for table of contents
print("\n" + "="*60)
print("Searching table of contents (first 30 pages)...")
print("="*60)

for page_num in range(min(30, len(reader.pages))):
    try:
        text = reader.pages[page_num].extract_text()

        # Look for chapter listings with page numbers
        if "Chapter 2" in text and ("Kinematics" in text or "Motion" in text):
            print(f"\nPage {page_num + 1} - TOC entry found:")
            # Find the line with Chapter 2
            for line in text.split('\n'):
                if 'Chapter 2' in line or 'Kinematics' in line:
                    print(f"  {line.strip()}")

        if "Chapter 11" in text and "Fluid" in text:
            print(f"\nPage {page_num + 1} - TOC entry found:")
            for line in text.split('\n'):
                if 'Chapter 11' in line or 'Fluid' in line:
                    print(f"  {line.strip()}")

    except Exception as e:
        pass

# Search specific page ranges more carefully
print("\n" + "="*60)
print("Detailed search in likely ranges...")
print("="*60)

# Kinematics typically in pages 60-150 for a physics textbook
print("\nSearching pages 60-150 for Kinematics...")
for page_num in range(60, min(150, len(reader.pages))):
    try:
        text = reader.pages[page_num].extract_text()
        if "2.1" in text and ("Displacement" in text or "Position" in text):
            print(f"  Page {page_num + 1}: Section 2.1 found - {text[:100]}...")
            break
        if "Problems" in text and "Exercises" in text and page_num > 70:
            print(f"  Page {page_num + 1}: Problems section found")
    except:
        pass

# Fluids typically in pages 450-550
print("\nSearching pages 450-600 for Fluids...")
for page_num in range(450, min(600, len(reader.pages))):
    try:
        text = reader.pages[page_num].extract_text()
        if "11.1" in text and "Fluid" in text:
            print(f"  Page {page_num + 1}: Section 11.1 found - {text[:100]}...")
            break
        if "CHAPTER 11" in text.upper():
            print(f"  Page {page_num + 1}: Chapter 11 header found")
    except:
        pass
