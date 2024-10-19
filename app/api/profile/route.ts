import { NextResponse } from "next/server";
import { prisma } from "@/utils/db"; // Adjust the import based on your project structure
import { getCurrentUser } from "@/utils/user";

export async function PATCH(request: Request) {
  const { firstName, lastName, email, contactNo, dateOfBirth, gender, image } = await request.json();
  const session = await getCurrentUser();

  if (!session?.currentUser?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.currentUser.id },
        data: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            contactNo: contactNo ? contactNo : undefined,
            dateOfBirth: dateOfBirth ? dateOfBirth : undefined,
            gender: gender ? gender : undefined,    
            image: image
        },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
