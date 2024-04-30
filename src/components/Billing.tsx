import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { File } from "@prisma/client";
import { Button } from "./ui/button";

const pricingPlans = [
  {
    name: "Basic",
    price: 0,
    features: ["1G", "10 Downloads", "10 Uploads"],
  },
  {
    name: "Pro",
    price: 7.99,
    features: ["50GB Storage", "50 Downloads", "50 Uploads"],
  },
  {
    name: "Business",
    price: 199.99,
    features: ["500GB Storage", "Unlimited Downloads", "Unlimited Uploads"],
  },
];

export default function Billing({ user, files }: { user: KindeUser; files: File[] }) {
  return (
    <>
      <div className="mb-4">
        <h1 className="text-3xl font-semibold">Billing</h1>
        <p className="text-gray-400">
          Choose the plan that best fits your needs. You can change or cancel your plan at any time.
        </p>

        <div className="my-4 rounded-md bg-yellow-100 p-4">
          <p className="font-bold text-yellow-900">
            This is just an dimostration of a billing page. You can implement your own billing
            system here.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <div key={plan.name} className="rounded-md bg-secondary p-4 shadow-md">
            <h2 className="text-2xl font-semibold">{plan.name}</h2>
            <p className="text-sm text-gray-500">Price: ${plan.price}</p>
            <ul className="list-inside list-disc">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Button className="my-4" disabled={plan.name === "Basic"}>
              {plan.name === "Basic" ? "Current Plan" : "Upgrade"}
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
