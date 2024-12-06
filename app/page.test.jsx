import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./page";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Home Page", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Hero section with correct content", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /Rent Furniture for Every Need/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Flexible rental options for home, office, and events.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Shop Now/i })
    ).toBeInTheDocument();
  });

  it("navigates to /product when 'Shop Now' is clicked", () => {
    render(<Home />);

    const shopNowButton = screen.getByRole("button", { name: /Shop Now/i });
    fireEvent.click(shopNowButton);

    expect(mockPush);
  });

  it("renders the Testimonies section with correct content", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /Why Choose Us\?/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Fast Delivery")).toBeInTheDocument();
    expect(
      screen.getByText("Get furniture delivered to your doorstep quickly.")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /What Our Customers Say/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Great service and quality furniture\. Highly recommend!/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Flexible rental plans made furnishing my apartment easy\./i
      )
    ).toBeInTheDocument();
  });

  it("renders the Footer section", () => {
    render(<Home />);

    expect(screen.getByText(/©/i)).toBeInTheDocument();
  });
});
