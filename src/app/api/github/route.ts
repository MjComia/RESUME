import { NextRequest, NextResponse } from "next/server";
import { PROFILE_DATA } from "@/data/seed";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

const CONTRIBUTIONS_QUERY = `
  query GetUserContributions($username: String!) {
    user(login: $username) {
      login
      url
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            firstDay
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
        }
      }
    }
  }
`;

function resolveUsername(): string {
  if (process.env.GITHUB_USERNAME?.trim()) {
    return process.env.GITHUB_USERNAME.trim();
  }
  const match = PROFILE_DATA.github.match(/github\.com\/([^/?#]+)/i);
  return match?.[1] || "MjComia";
}

export async function GET(request: NextRequest) {
  const token = process.env.GITHUB_TOKEN?.trim();
  const username = resolveUsername();

  if (!token) {
    return NextResponse.json(
      {
        error:
          "GITHUB_TOKEN is not set in .env. Add a read-only GitHub Personal Access Token and restart the server.",
        username,
      },
      { status: 503 }
    );
  }

  const forceFresh = request.nextUrl.searchParams.get("refresh") === "1";

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { username },
      }),
      ...(forceFresh
        ? { cache: "no-store" as const }
        : { next: { revalidate: 1800 } }),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `GitHub API returned HTTP ${response.status}. Check that GITHUB_TOKEN in .env is valid and has not expired.`,
          username,
        },
        { status: response.status }
      );
    }

    const json = await response.json();

    if (json.errors?.length) {
      return NextResponse.json(
        {
          error: json.errors[0]?.message || "GitHub GraphQL query failed.",
          username,
        },
        { status: 400 }
      );
    }

    const user = json.data?.user;
    if (!user) {
      return NextResponse.json(
        {
          error: `GitHub user "${username}" was not found.`,
          username,
        },
        { status: 404 }
      );
    }

    const collection = user.contributionsCollection;
    const calendar = collection.contributionCalendar;

    return NextResponse.json({
      username: user.login,
      profileUrl: user.url,
      totalContributions: calendar.totalContributions as number,
      totalCommits: collection.totalCommitContributions as number,
      restrictedCount: collection.restrictedContributionsCount as number,
      weeks: calendar.weeks as Array<{
        firstDay: string;
        contributionDays: Array<{
          date: string;
          contributionCount: number;
          weekday: number;
        }>;
      }>,
      fetchedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not reach api.github.com. Verify your internet connection and retry.",
        username,
      },
      { status: 502 }
    );
  }
}

