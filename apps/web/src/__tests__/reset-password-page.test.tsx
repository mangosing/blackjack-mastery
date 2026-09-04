import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ResetPasswordPage from "../app/reset-password/page";

const { mockGetSession, mockUpdateUser } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockUpdateUser: vi.fn(),
}));

vi.mock("../lib/supabase/client", () => ({
  getSupabaseClient: () => ({
    auth: {
      getSession: mockGetSession,
      updateUser: mockUpdateUser,
    },
  }),
}));

describe("Reset password page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the password form for an authenticated recovery session", async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: {},
        },
      },
      error: null,
    });

    render(<ResetPasswordPage />);

    expect(
      await screen.findByRole("heading", { name: "Choose a new password" }),
    ).toBeInTheDocument();

    const passwordInput = screen.getByLabelText("New password");
    const confirmationInput = screen.getByLabelText("Confirm new password");

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toBeRequired();

    expect(confirmationInput).toHaveAttribute("type", "password");
    expect(confirmationInput).toBeRequired();

    expect(screen.getByRole("button", { name: "Update password" })).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Back to login" })).toHaveAttribute("href", "/login");
  });

  it("rejects a missing or invalid recovery session", async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: null,
      },
      error: null,
    });

    render(<ResetPasswordPage />);

    expect(
      await screen.findByRole("heading", { name: "Reset link unavailable" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "This password-reset link is invalid or expired.",
    );

    expect(screen.getByRole("link", { name: "Request another reset link" })).toHaveAttribute(
      "href",
      "/forgot-password",
    );

    expect(screen.queryByRole("button", { name: "Update password" })).not.toBeInTheDocument();

    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it("rejects mismatched passwords without updating the user", async () => {
    const user = userEvent.setup();

    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: {},
        },
      },
      error: null,
    });

    render(<ResetPasswordPage />);

    await screen.findByRole("heading", { name: "Choose a new password" });

    await user.type(screen.getByLabelText("New password"), "new-secret-password");
    await user.type(screen.getByLabelText("Confirm new password"), "different-password");
    await user.click(screen.getByRole("button", { name: "Update password" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Passwords do not match.");

    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it("updates the password for a valid recovery session", async () => {
    const user = userEvent.setup();

    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: {},
        },
      },
      error: null,
    });

    mockUpdateUser.mockResolvedValue({
      data: {
        user: {},
      },
      error: null,
    });

    render(<ResetPasswordPage />);

    await screen.findByRole("heading", { name: "Choose a new password" });

    await user.type(screen.getByLabelText("New password"), "new-secret-password");
    await user.type(screen.getByLabelText("Confirm new password"), "new-secret-password");
    await user.click(screen.getByRole("button", { name: "Update password" }));

    expect(mockUpdateUser).toHaveBeenCalledWith({
      password: "new-secret-password",
    });

    expect(await screen.findByRole("status")).toHaveTextContent("Your password has been updated.");

    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
  });

  it("shows a safe error when the password update fails", async () => {
    const user = userEvent.setup();

    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: {},
        },
      },
      error: null,
    });

    mockUpdateUser.mockResolvedValue({
      data: {
        user: null,
      },
      error: {
        message: "Internal Supabase password details",
      },
    });

    render(<ResetPasswordPage />);

    await screen.findByRole("heading", { name: "Choose a new password" });

    await user.type(screen.getByLabelText("New password"), "new-secret-password");
    await user.type(screen.getByLabelText("Confirm new password"), "new-secret-password");
    await user.click(screen.getByRole("button", { name: "Update password" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to update your password. Please try again.",
    );

    expect(screen.queryByText("Internal Supabase password details")).not.toBeInTheDocument();
  });

  it("disables submission while the password update is pending", async () => {
    const user = userEvent.setup();

    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: {},
        },
      },
      error: null,
    });

    let resolveUpdate!: (value: {
      data: {
        user: object;
      };
      error: null;
    }) => void;

    mockUpdateUser.mockReturnValue(
      new Promise((resolve) => {
        resolveUpdate = resolve;
      }),
    );

    render(<ResetPasswordPage />);

    await screen.findByRole("heading", { name: "Choose a new password" });

    await user.type(screen.getByLabelText("New password"), "new-secret-password");
    await user.type(screen.getByLabelText("Confirm new password"), "new-secret-password");
    await user.click(screen.getByRole("button", { name: "Update password" }));

    expect(screen.getByRole("button", { name: "Updating password..." })).toBeDisabled();

    resolveUpdate({
      data: {
        user: {},
      },
      error: null,
    });

    expect(await screen.findByRole("status")).toHaveTextContent("Your password has been updated.");
  });
});
