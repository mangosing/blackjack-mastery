import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ForgotPasswordPage from "../app/forgot-password/page";

const { mockResetPasswordForEmail } = vi.hoisted(() => ({
  mockResetPasswordForEmail: vi.fn(),
}));

vi.mock("../lib/supabase/client", () => ({
  getSupabaseClient: () => ({
    auth: {
      resetPasswordForEmail: mockResetPasswordForEmail,
    },
  }),
}));

describe("Forgot password page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests a reset email without revealing whether the account exists", async () => {
    const user = userEvent.setup();

    mockResetPasswordForEmail.mockResolvedValue({
      data: {},
      error: null,
    });

    render(<ForgotPasswordPage />);

    await user.type(screen.getByLabelText("Email"), "sean@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(mockResetPasswordForEmail).toHaveBeenCalledWith("sean@example.com", {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    expect(await screen.findByRole("status")).toHaveTextContent(
      "If an account exists for that email, a password-reset link has been sent.",
    );
  });

  it("renders the reset request form", () => {
    render(<ForgotPasswordPage />);

    expect(screen.getByRole("heading", { name: "Reset your password" })).toBeInTheDocument();

    const emailInput = screen.getByLabelText("Email");

    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toBeRequired();

    expect(screen.getByRole("button", { name: "Send reset link" })).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Back to login" })).toHaveAttribute("href", "/login");
  });

  it("shows a safe error when the reset request fails", async () => {
    const user = userEvent.setup();

    mockResetPasswordForEmail.mockResolvedValue({
      data: {},
      error: {
        message: "Internal Supabase email details",
      },
    });

    render(<ForgotPasswordPage />);

    await user.type(screen.getByLabelText("Email"), "sean@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to send a reset link. Please try again.",
    );

    expect(screen.queryByText("Internal Supabase email details")).not.toBeInTheDocument();
  });

  it("disables submission while the reset request is pending", async () => {
    const user = userEvent.setup();

    let resolveRequest!: (value: { data: object; error: null }) => void;

    mockResetPasswordForEmail.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );

    render(<ForgotPasswordPage />);

    await user.type(screen.getByLabelText("Email"), "sean@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(screen.getByRole("button", { name: "Sending reset link..." })).toBeDisabled();

    resolveRequest({
      data: {},
      error: null,
    });

    expect(await screen.findByRole("status")).toHaveTextContent(
      "If an account exists for that email, a password-reset link has been sent.",
    );
  });
});
