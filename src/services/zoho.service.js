const axios = require("axios");
const env = require("../config/env");
const Birthday = require("../models/Birthday.model");

class ZohoService {
  async getAccessToken() {
    if (!env.zoho.clientId || !env.zoho.clientSecret || !env.zoho.refreshToken) {
      console.warn("[Zoho Service] Zoho credentials not fully configured in environment.");
      return null;
    }

    try {
      const response = await axios.post("https://accounts.zoho.com/oauth/v2/token", null, {
        params: {
          refresh_token: env.zoho.refreshToken,
          client_id: env.zoho.clientId,
          client_secret: env.zoho.clientSecret,
          grant_type: "refresh_token",
        },
      });

      return response.data.access_token || null;
    } catch (error) {
      console.error("[Zoho Service Error] Failed to refresh access token:", error.response?.data || error.message);
      return null;
    }
  }

  async syncBirthdays() {
    console.log("[Zoho Service] Starting employee birthday sync...");
    const token = await this.getAccessToken();

    // Fallback placeholder sync if Zoho is not configured
    if (!token) {
      console.log("[Zoho Service] Zoho API token unavailable. Executing mock sync check.");
      return {
        syncedCount: 0,
        message: "Zoho API integration standing by (Credentials required in .env)",
      };
    }

    try {
      const response = await axios.get("https://people.zoho.com/people/api/v2/records", {
        headers: { Authorization: `Zoho-oauthtoken ${token}` },
        params: { searchParams: { Date_of_birth: new Date().toISOString().split("T")[0] } },
      });

      const records = response.data?.data || [];
      let syncedCount = 0;

      for (const record of records) {
        const employeeName = `${record.First_Name || ""} ${record.Last_Name || ""}`.trim() || "Employee";
        const existing = await Birthday.findOne({
          where: {
            employeeName,
            birthdayDate: new Date().toISOString().split("T")[0],
            isDeleted: false,
          },
        });

        if (!existing) {
          await Birthday.create({
            employeeName,
            department: record.Department || "General",
            designation: record.Designation || "Team Member",
            greetingMessage: `Happy Birthday ${employeeName}! Have a fantastic day!`,
            birthdayDate: new Date().toISOString().split("T")[0],
            status: "published",
            template: "celebration",
          });
          syncedCount++;
        }
      }

      return { syncedCount, message: `Successfully synced ${syncedCount} birthday record(s) from Zoho People.` };
    } catch (error) {
      console.error("[Zoho Service Error] Birthday sync failed:", error.response?.data || error.message);
      return { syncedCount: 0, message: `Zoho sync failed: ${error.message}` };
    }
  }
}

module.exports = new ZohoService();
