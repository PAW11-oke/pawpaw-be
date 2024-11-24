export async function GET(req) {
    try {
        // Auth check
        const authResult = await authMiddleware(req);
        if (!authResult || authResult.status === 401) {
            return new Response("Unauthorized", { status: 401 });
        }

        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query') || '';
        const limit = parseInt(searchParams.get('limit') || '10');

        // Build search query
        const searchQuery = {
            owner: req.userId, // Only get pets owned by the user
            name: { $regex: query, $options: 'i' } // Case-insensitive search
        };

        // Get pets with selected fields only
        const pets = await Pet.find(searchQuery)
            .select('_id name petType breed photo')
            .limit(limit)
            .lean();

        return new Response(
            JSON.stringify({
                success: true,
                data: pets.map(pet => ({
                    id: pet._id,
                    name: pet.name,
                    petType: pet.petType,
                    breed: pet.breed || '',
                    photo: pet.photo || '/DefaultProfilePicture.png',
                    // Format untuk ditampilkan di dropdown
                    label: `${pet.name} (${pet.petType}${pet.breed ? ` - ${pet.breed}` : ''})`
                }))
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error('Error searching pets:', error);
        return new Response(
            JSON.stringify({ 
                success: false, 
                error: 'Failed to search pets.' 
            }),
            { status: 500 }
        );
    }
}