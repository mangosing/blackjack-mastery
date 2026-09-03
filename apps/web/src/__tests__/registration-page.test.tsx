import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import RegistrationPage from "../app/register/page";

const { mockReplace, mockSignUp } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockSignUp: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

vi.mock("../lib/supabase/client", () => ({
  getSupabaseClient: () => ({
    auth: {
      signUp: mockSignUp,
    },
  }),
}));

describe("Registration page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates an account and redirects when a session is returned", async () => {
    const user = userEvent.setup();

    mockSignUp.mockResolvedValue({
      data: {
        user: {},
        session: {},
      },
      error: null,
    });

    render(<RegistrationPage />);

    await user.type(screen.getByLabelText("Email"), "sean@example.com");
    await user.type(screen.getByLabelText("Password"), "secret-password");
    await user.type(screen.getByLabelText("Confirm password"), "secret-password");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(mockSignUp).toHaveBeenCalledWith({
      email: "sean@example.com",
      password: "secret-password",
    });

    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("rejects mismatched passwords without contacting Supabase", async () => {
    const user = userEvent.setup();

    render(<RegistrationPage />);

    await user.type(screen.getByLabelText("Email"), "sean@example.com");
    await user.type(screen.getByLabelText("Password"), "secret-password");
    await user.type(screen.getByLabelText("Confirm password"), "different-password");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Passwords do not match.");

    expect(mockSignUp).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("renders the registration form", () => {
    render(<RegistrationPage />);

    expect(screen.getByRole("heading", { name: "Create your account" })).toBeInTheDocument();

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const passwordConfirmationInput = screen.getByLabelText("Confirm password");

    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toBeRequired();

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toBeRequired();

    expect(passwordConfirmationInput).toHaveAttribute("type", "password");
    expect(passwordConfirmationInput).toBeRequired();

    expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
  });

  it("shows a confirmation message when email verification is required", async () => {
    const user = userEvent.setup();

    mockSignUp.mockResolvedValue({
      data: {
        user: {},
        session: null,
      },
      error: null,
    });

    render(<RegistrationPage />);

    await user.type(screen.getByLabelText("Email"), "sean@example.com");
    await user.type(screen.getByLabelText("Password"), "secret-password");
    await user.type(screen.getByLabelText("Confirm password"), "secret-password");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Check your email to confirm your account before logging in.",
    );

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("shows a safe error when account creation fails", async () => {
    const user = userEvent.setup();

    mockSignUp.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: {
        message: "Internal Supabase authentication details",
      },
    });

    render(<RegistrationPage />);

    await user.type(screen.getByLabelText("Email"), "sean@example.com");
    await user.type(screen.getByLabelText("Password"), "secret-password");
    await user.type(screen.getByLabelText("Confirm password"), "secret-password");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to create your account. Please try again.",
    );

    expect(screen.queryByText("Internal Supabase authentication details")).not.toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("disables submission while account creation is pending", async () => {
    const user = userEvent.setup();

    let resolveRegistration!: (value: {
      data: {
        user: object;
        session: object;
      };
      error: null;
    }) => void;

    mockSignUp.mockReturnValue(
      new Promise((resolve) => {
        resolveRegistration = resolve;
      }),
    );

    render(<RegistrationPage />);

    await user.type(screen.getByLabelText("Email"), "sean@example.com");
    await user.type(screen.getByLabelText("Password"), "secret-password");
    await user.type(screen.getByLabelText("Confirm password"), "secret-password");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByRole("button", { name: "Creating account..." })).toBeDisabled();

    resolveRegistration({
      data: {
        user: {},
        session: {},
      },
      error: null,
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });
});
