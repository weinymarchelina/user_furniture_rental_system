import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthUser from "../../components/auth/AuthUser";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: "/",
  }),
}));

describe("AuthUser", () => {
  it("should render the AuthUser component", () => {
    render(<AuthUser />);

    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("should handle login errors", async () => {
    render(<AuthUser />);

    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });

  it("should redirect on successful login", async () => {
    render(<AuthUser />);

    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "correctpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockPush);
    });
  });
});
