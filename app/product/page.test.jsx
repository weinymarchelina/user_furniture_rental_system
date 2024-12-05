import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Products from "../../components/crud/Products";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockProduct = {
  _id: "673cb3feebe4fd474f91275d",
  gType: "Chair",
  gPrice: 200,
  gNum: 15,
  gID: 1,
  gImage:
    "https://res.cloudinary.com/tigervision/image/upload/v1732169812/school…",
  updated_at: "2024-12-03T09:03:33.975+00:00",
};

describe("Products Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
  });

  it("should render a list of products when API returns products", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [mockProduct],
      }),
    });

    render(<Products />);

    await waitFor(() => screen.getByText(/Chair/));

    expect(screen.getByText(/Chair/)).toBeInTheDocument();
    expect(screen.getByText(/Price: \$200/)).toBeInTheDocument();
    expect(screen.getByText(/Available: 15/)).toBeInTheDocument();
  });

  it("should show 'No products available' if no products are returned", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [],
      }),
    });

    render(<Products />);

    await waitFor(() => screen.getByText(/No products available/));

    expect(screen.getByText(/No products available/)).toBeInTheDocument();
  });

  it("should navigate to checkout page when the 'Buy' button is clicked", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [mockProduct],
      }),
    });

    render(<Products />);

    await waitFor(() => screen.getByText(/Chair/));

    fireEvent.click(screen.getByRole("button", { name: /Buy/i }));

    expect(document.cookie).toContain(`product=${JSON.stringify(mockProduct)}`);

    expect(mockPush).toHaveBeenCalledWith("/checkout");
  });

  it("should handle fetch errors gracefully", async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValueOnce(new Error("Failed to fetch"));

    render(<Products />);

    await waitFor(() => screen.getByText(/No products available/));
    expect(screen.getByText(/No products available/)).toBeInTheDocument();
  });
});
