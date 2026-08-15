import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@core/db';
import { IntegrityReport } from '@/models/IntegrityReport';

/**
 * GET: Serve a saved report as an HTML page.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id.length < 10) {
      return new NextResponse('Report not found.', { status: 404, headers: { 'Content-Type': 'text/html' } });
    }

    await connectDB();

    const report = await IntegrityReport.findById(id).lean() as { html: string } | null;
    if (!report) {
      return new NextResponse(
        '<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:80px;"><h1>Report Not Found</h1><p>This report may have expired or been removed.</p></body></html>',
        { status: 404, headers: { 'Content-Type': 'text/html' } }
      );
    }

    return new NextResponse(report.html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      },
    });
  } catch (error) {
    console.error('Report fetch error:', error);
    return new NextResponse('Error loading report.', { status: 500, headers: { 'Content-Type': 'text/html' } });
  }
}
