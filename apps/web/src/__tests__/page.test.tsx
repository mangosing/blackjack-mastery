import { render, screen } from "@testing-library/react";

import Home from "../app/page";

describe("Home page", () => {
  it("renders the product name", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: "Blackjack Mastery" })).toBeInTheDocument();
  });
});
