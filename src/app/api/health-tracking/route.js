import { connectToDatabase } from "@/utils/dbConfig";
import { NextResponse } from "next/server";
import HealthTracking from "@/models/healthTrackingModel";
import Pet from "@/models/petModel";

export async function GET(req) {
    await connectToDatabase();

    // Verifikasi autentikasi
    const authResult = await authMiddleware(req);
    if (authResult && authResult.status === 401) {
        return authResult;
    }

    try {
        const userId = req.userId;

        // Cari semua HealthTracking milik user
        const healthTrackingRecords = await HealthTracking.find({ user: userId }).populate('pet');

        if (!healthTrackingRecords || healthTrackingRecords.length === 0) {
            return new Response(
                JSON.stringify({ error: 'No health tracking records found.' }),
                { status: 404 }
            );
        }

        // Proses setiap record untuk menyertakan foto hewan
        const result = await Promise.all(
            healthTrackingRecords.map(async (record) => {
                const pet = record.pet;

                if (!pet) {
                    return { ...record.toObject(), petPhoto: null };
                }

                return {
                    ...record.toObject(),
                    petPhoto: pet.photo || null, // URL foto hewan dari Cloudinary
                };
            })
        );

        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.error('Error fetching health tracking records:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch health tracking records.' }),
            { status: 500 }
        );
    }
}

export async function POST(request) { 
    const { pet, petName, medicalHistory, allergies, vaccines } = await request.json();
    // fetch list name pets dulu dari '/api/pets?name='
        await connectToDatabase();
    
        let petId;
    
        if (petName) {
        // Find the pet by name and get its ID
        const foundPet = await Pet.findOne({ name: petName });
        if (!foundPet) {
            return NextResponse.json({ error: 'Pet not found.' }, { status: 404 });
        }
        petId = foundPet._id;
        } else if (pet) {
        petId = pet;
        } else {
        return NextResponse.json({ error: 'Either pet ID or pet name is required.' }, { status: 400 });
        }
    
        const newHealthTracking = await HealthTracking.create({
        pet: petId,
        medicalHistory,
        allergies,
        vaccines,
        });

    return NextResponse.json({ success: true, data: newHealthTracking }, { status: 201 });
}

export async function PUT(req) {
    await connectToDatabase(); // Pastikan database terhubung

    try {
        // Parse data dari request body
        const { id, pet, medicalHistory, vaccines, allergies } = await req.json();

        // Validasi apakah ID disediakan
        if (!id) {
            return NextResponse.json(
                { error: 'HealthTracking ID is required.' },
                { status: 400 }
            );
        }

        const updateData = {};

        if (pet) updateData.pet = pet;
        if (medicalHistory) updateData.medicalHistory = medicalHistory;
        if (vaccines) updateData.vaccines = vaccines;
        if (allergies) updateData.allergies = allergies;

        // Update dokumen berdasarkan ID
        const updatedHealthTracking = await HealthTracking.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true } // Mengembalikan dokumen yang diperbarui
        );

        // Jika data tidak ditemukan
        if (!updatedHealthTracking) {
            return NextResponse.json(
                { error: 'HealthTracking record not found.' },
                { status: 404 }
            );
        }

        // Berhasil memperbarui data
        return NextResponse.json(
            { message: 'HealthTracking updated successfully.', data: updatedHealthTracking },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating HealthTracking:', error);
        return NextResponse.json(
            { error: 'Failed to update HealthTracking.' },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    await connectToDatabase(); // Pastikan database terhubung

    try {
        // Ambil ID pet dari query params
        const petId = req.nextUrl.searchParams.get('petId');

        if (!petId) {
            return NextResponse.json(
                { error: 'Pet ID is required.' },
                { status: 400 }
            );
        }

        // Cari dan hapus HealthTracking berdasarkan petId
        const deletedHealthTracking = await HealthTracking.findOneAndDelete({ pet: petId });

        // Jika data tidak ditemukan
        if (!deletedHealthTracking) {
            return NextResponse.json(
                { error: 'HealthTracking record not found for the given Pet ID.' },
                { status: 404 }
            );
        }

        // Berhasil menghapus data
        return NextResponse.json(
            { message: 'HealthTracking deleted successfully.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting HealthTracking:', error);
        return NextResponse.json(
            { error: 'Failed to delete HealthTracking.' },
            { status: 500 }
        );
    }
}