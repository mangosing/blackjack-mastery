import { expect, test } from "@playwright/test";

test("loads the Blackjack Mastery home page", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Blackjack Mastery" })).toBeVisible();
});
