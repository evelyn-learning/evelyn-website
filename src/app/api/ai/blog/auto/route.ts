import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getAutoSettings,
  updateAutoSettings,
  INTERVAL_CRON_EXPRESSIONS,
} from "@/lib/services/auto-blog-generator";
import {
  startAutoBlogScheduler,
  stopAutoBlogScheduler,
  isAutoBlogSchedulerActive,
  triggerAutoBlogGeneration,
} from "@/lib/services/blog-scheduler";

// GET - Get auto blog settings and status
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getAutoSettings();
    const isRunning = isAutoBlogSchedulerActive();

    return NextResponse.json({
      success: true,
      settings: {
        enabled: settings.enabled,
        intervalType: settings.intervalType,
        customCronExpression: settings.customCronExpression,
        preferredCategories: settings.preferredCategories,
        preferredMarkets: settings.preferredMarkets,
        preferredTones: settings.preferredTones,
        preferredLength: settings.preferredLength,
        preferredImageStyle: settings.preferredImageStyle,
        autoPublish: settings.autoPublish,
        maxRecentToTrack: settings.maxRecentToTrack,
      },
      stats: {
        totalGenerated: settings.totalGenerated,
        lastGeneratedAt: settings.lastGeneratedAt,
        lastError: settings.lastError,
        recentGenerations: settings.recentGenerations.slice(0, 5),
      },
      scheduler: {
        isRunning,
      },
      intervalOptions: Object.keys(INTERVAL_CRON_EXPRESSIONS),
    });
  } catch (error) {
    console.error("Get auto settings error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get settings",
      },
      { status: 500 }
    );
  }
}

// POST - Update settings or perform actions
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    // Handle actions
    if (action === "start") {
      // Enable and start scheduler
      await updateAutoSettings({ enabled: true });
      const result = await startAutoBlogScheduler();
      return NextResponse.json({
        success: result.success,
        message: result.message,
        cronExpression: result.cronExpression,
      });
    }

    if (action === "stop") {
      // Disable and stop scheduler
      await updateAutoSettings({ enabled: false });
      stopAutoBlogScheduler();
      return NextResponse.json({
        success: true,
        message: "Auto blog scheduler stopped",
      });
    }

    if (action === "generate") {
      // Trigger immediate generation
      const result = await triggerAutoBlogGeneration();
      return NextResponse.json(result);
    }

    if (action === "restart") {
      // Restart scheduler with current settings
      stopAutoBlogScheduler();
      const settings = await getAutoSettings();
      if (settings.enabled) {
        const result = await startAutoBlogScheduler();
        return NextResponse.json({
          success: result.success,
          message: result.message,
          cronExpression: result.cronExpression,
        });
      }
      return NextResponse.json({
        success: true,
        message: "Scheduler stopped (auto generation is disabled)",
      });
    }

    // Handle settings update
    const updates: Record<string, unknown> = {};

    if (typeof body.enabled === "boolean") {
      updates.enabled = body.enabled;
    }

    if (body.intervalType && Object.keys(INTERVAL_CRON_EXPRESSIONS).includes(body.intervalType)) {
      updates.intervalType = body.intervalType;
    }

    if (body.intervalType === "custom" && body.customCronExpression) {
      updates.customCronExpression = body.customCronExpression;
    }

    if (Array.isArray(body.preferredCategories)) {
      updates.preferredCategories = body.preferredCategories;
    }

    if (Array.isArray(body.preferredMarkets)) {
      updates.preferredMarkets = body.preferredMarkets;
    }

    if (Array.isArray(body.preferredTones)) {
      updates.preferredTones = body.preferredTones;
    }

    if (body.preferredLength) {
      updates.preferredLength = body.preferredLength;
    }

    if (body.preferredImageStyle) {
      updates.preferredImageStyle = body.preferredImageStyle;
    }

    if (typeof body.autoPublish === "boolean") {
      updates.autoPublish = body.autoPublish;
    }

    if (typeof body.maxRecentToTrack === "number") {
      updates.maxRecentToTrack = body.maxRecentToTrack;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid updates provided" },
        { status: 400 }
      );
    }

    const updatedSettings = await updateAutoSettings(updates);

    // Restart scheduler if it's running and settings changed
    if (isAutoBlogSchedulerActive() && updatedSettings.enabled) {
      stopAutoBlogScheduler();
      await startAutoBlogScheduler();
    }

    return NextResponse.json({
      success: true,
      settings: {
        enabled: updatedSettings.enabled,
        intervalType: updatedSettings.intervalType,
        customCronExpression: updatedSettings.customCronExpression,
        preferredCategories: updatedSettings.preferredCategories,
        preferredMarkets: updatedSettings.preferredMarkets,
        preferredTones: updatedSettings.preferredTones,
        preferredLength: updatedSettings.preferredLength,
        preferredImageStyle: updatedSettings.preferredImageStyle,
        autoPublish: updatedSettings.autoPublish,
      },
    });
  } catch (error) {
    console.error("Update auto settings error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update settings",
      },
      { status: 500 }
    );
  }
}
