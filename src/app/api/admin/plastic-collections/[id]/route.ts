import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { idValidationSchema } from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"
import { PlasticCollection } from "@prisma/client"
import { updateCollectionSchema } from "@/utils/validation/collection/collection"

interface ExtendedPlasticCollection extends PlasticCollection {
	userName: string
	claimedByName?: string
}

export async function GET(
	_: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const [__, props] = await Promise.all([checkAuth(), params])
	try {
		const { id: collectionId } = props

		const idValidationRess = idValidationSchema.safeParse(collectionId)
		if (!idValidationRess.success) {
			return NextResponse.json(
				{
					message: idValidationRess.error.format(),
				},
				{ status: 400 }
			)
		}

		const resultantCollection = (await prisma.plasticCollection.findUnique({
			where: {
				id: collectionId,
			},
		})) as ExtendedPlasticCollection

		if (!resultantCollection) {
			return NextResponse.json(
				{ error: "Collection not found" },
				{ status: 404 }
			)
		}

		if (resultantCollection.status === "Claimed") {
			const agent = (await prisma.user.findUnique({
				where: {
					id: resultantCollection.userId,
				},
				select: {
					name: true,
				},
			})) as {
				name: string
			}

			resultantCollection["claimedByName"] = agent.name

			return NextResponse.json(resultantCollection, { status: 200 })
		}

		return NextResponse.json(resultantCollection, { status: 200 })
	} catch (e) {
		logErrors(e)
		return NextResponse.json({ error: e }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const [__, props] = await Promise.all([checkAuth(), params])
	try {
		const { id: collectionId } = props

		const idValidationRes = idValidationSchema.safeParse(collectionId)
		if (!idValidationRes.success) {
			return NextResponse.json(
				{ message: idValidationRes.error.format() },
				{ status: 400 }
			)
		}

		const body = await req.json()
		const validationRes = updateCollectionSchema.safeParse(body)
		if (!validationRes.success) {
			return NextResponse.json(
				{ message: validationRes.error.format() },
				{ status: 400 }
			)
		}

		const updateData = validationRes.data

		const existingCollection = await prisma.plasticCollection.findUnique({
			where: { id: collectionId },
		})
		if (!existingCollection) {
			return NextResponse.json(
				{ error: "Collection not found" },
				{ status: 404 }
			)
		}

		const updatedCollection = await prisma.plasticCollection.update({
			where: { id: collectionId },
			data: updateData,
		})

		return NextResponse.json(updatedCollection, { status: 200 })
	} catch (e) {
		logErrors(e)
		return NextResponse.json({ error: e }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}
