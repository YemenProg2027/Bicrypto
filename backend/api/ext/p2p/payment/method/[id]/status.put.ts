import { createError } from "@b/utils/error";
import { updateStatus, updateRecordResponses } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Updates the active status of a P2P Payment Method",
  operationId: "updateP2PPaymentMethodStatus",
  tags: ["P2P", "Payment Methods"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the P2P payment method to update",
      schema: { type: "string" },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            status: {
              type: "boolean",
              description:
                "New active status to apply (true for active, false for inactive)",
            },
          },
          required: ["status"],
        },
      },
    },
  },
  responses: updateRecordResponses("P2P Payment Method"),
  requiresAuth: true,
};

export default async (data) => {
  const { user, body, params } = data;
  if (!user?.id) throw createError(401, "Unauthorized");

  const { id } = params;
  const { status } = body;
  return updateStatus(
    "p2pPaymentMethod",
    id,
    status,
    undefined,
    undefined,
    undefined,
    {
      userId: user.id,
    }
  );
};
