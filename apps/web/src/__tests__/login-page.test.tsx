import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LoginPage from "../app/login/page";

const { mockReplace, mockSignInWithPassword } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockSignInWithPassword: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

vi.mock("../lib/supabase/client", () => ({
  supabase: {
    auth: {
      signInWithPassword: mockSignInWithPassword,
    },
  },
}));

describe("Login page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a safe error when login fails", async () => {
    const user = userEvent.setup();

    mockSignInWithPassword.mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: {
        message: "Internal authentication details",
      },
    });

    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "sean@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to log in. Check your email and password.",
    );

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("renders the login form", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("heading", { name: "Log in to Blackjack Mastery" }),
    ).toBeInTheDocument();

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toBeRequired();

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toBeRequired();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
  });

  it("logs in and redirects the user", async () => {
    const user = userEvent.setup();

    mockSignInWithPassword.mockResolvedValue({
      data: {
        user: {},
        session: {},
      },
      error: null,
    });

    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "sean@example.com");
    await user.type(screen.getByLabelText("Password"), "secret-password");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "sean@example.com",
        password: "secret-password",
      });
    });

    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("disables the submit button while login is pending", async () => {
    const user = userEvent.setup();

    let resolveLogin!: (value: {
      data: {
        user: object;
        session: object;
      };
      error: null;
    }) => void;

    mockSignInWithPassword.mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      }),
    );

    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "sean@example.com");
    await user.type(screen.getByLabelText("Password"), "secret-password");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(screen.getByRole("button", { name: "Logging in..." })).toBeDisabled();

    resolveLogin({
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
