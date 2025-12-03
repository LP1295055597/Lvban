import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-96158a40/health", (c) => {
  return c.json({ status: "ok" });
});

// Order alert endpoint - 订单报警系统
app.post("/make-server-96158a40/order-alert", async (c) => {
  try {
    const body = await c.req.json();
    const { orderId, guideName, reminderCount, totalPenalty, orderEndTime, alertTime } = body;

    // 记录报警信息到KV存储
    const alertKey = `order_alert:${orderId}:${Date.now()}`;
    const alertData = {
      orderId,
      guideName,
      reminderCount,
      totalPenalty,
      orderEndTime,
      alertTime,
      status: 'pending', // 报警状态：pending, contacted, resolved
      createdAt: new Date().toISOString()
    };

    await kv.set(alertKey, JSON.stringify(alertData));

    // 记录到总的报警列表
    const alertListKey = 'order_alerts:list';
    const existingAlerts = await kv.get(alertListKey);
    const alertsList = existingAlerts ? JSON.parse(existingAlerts) : [];
    alertsList.push({
      alertKey,
      orderId,
      guideName,
      alertTime,
      status: 'pending'
    });
    await kv.set(alertListKey, JSON.stringify(alertsList));

    // 这里可以添加其他通知逻辑，例如：
    // - 发送短信到平台工作人员
    // - 发送邮件通知
    // - 推送到管理后台
    console.log(`订单报警：订单 #${orderId}，旅行管家：${guideName}，已提醒${reminderCount}次，扣除${totalPenalty}元`);

    return c.json({
      success: true,
      message: '报警已记录，平台工作人员将尽快处理',
      alertKey
    });
  } catch (error) {
    console.error('订单报警处理失败：', error);
    return c.json(
      {
        success: false,
        error: `订单报警处理失败: ${error instanceof Error ? error.message : '未知错误'}`
      },
      500
    );
  }
});

// Get all alerts - 获取所有报警记录（后台管理用）
app.get("/make-server-96158a40/order-alerts", async (c) => {
  try {
    const alertListKey = 'order_alerts:list';
    const existingAlerts = await kv.get(alertListKey);
    const alertsList = existingAlerts ? JSON.parse(existingAlerts) : [];

    // 获取每个报警的详细信息
    const alertsWithDetails = await Promise.all(
      alertsList.map(async (alert: any) => {
        const detailData = await kv.get(alert.alertKey);
        return {
          ...alert,
          details: detailData ? JSON.parse(detailData) : null
        };
      })
    );

    return c.json({
      success: true,
      alerts: alertsWithDetails
    });
  } catch (error) {
    console.error('获取报警记录失败：', error);
    return c.json(
      {
        success: false,
        error: `获取报警记录失败: ${error instanceof Error ? error.message : '未知错误'}`
      },
      500
    );
  }
});

// Update alert status - 更新报警状态
app.put("/make-server-96158a40/order-alert/:alertKey", async (c) => {
  try {
    const alertKey = c.req.param('alertKey');
    const { status, notes } = await c.req.json();

    const existingData = await kv.get(alertKey);
    if (!existingData) {
      return c.json({ success: false, error: '报警记录不存在' }, 404);
    }

    const alertData = JSON.parse(existingData);
    alertData.status = status;
    alertData.notes = notes;
    alertData.updatedAt = new Date().toISOString();

    await kv.set(alertKey, JSON.stringify(alertData));

    return c.json({
      success: true,
      message: '报警状态已更新'
    });
  } catch (error) {
    console.error('更新报警状态失败：', error);
    return c.json(
      {
        success: false,
        error: `更新报警状态失败: ${error instanceof Error ? error.message : '未知错误'}`
      },
      500
    );
  }
});

Deno.serve(app.fetch);