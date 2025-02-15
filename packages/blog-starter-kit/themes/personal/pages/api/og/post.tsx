import { resizeImage } from '@starter-kit/utils/image';
import { ImageResponse } from '@vercel/og';
import { type NextRequest } from 'next/server';
import { DEFAULT_AVATAR } from '../../../utils/const';

export const config = {
    runtime: 'edge',
};

// Chargement des polices
const fontRegular = fetch(new URL('../../../assets/PlusJakartaSans-Regular.ttf', import.meta.url)).then(
    (res) => res.arrayBuffer(),
);

export default async function handler(req: NextRequest) {
    const [fontDataRegular] = await Promise.all([fontRegular]);
    const { searchParams } = new URL(req.url);
    const ogData = JSON.parse(atob(searchParams.get('og') as string));
    const photoUrl = ogData.photo ? resizeImage(ogData.photo, {}) : DEFAULT_AVATAR;

    return new ImageResponse(
        (
            <div>
                <img src={photoUrl} alt="Author" style={{ width: '64px', height: '64px', borderRadius: '50%' }} />
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'Plus Jakarta Sans',
                    data: fontDataRegular,
                    style: 'normal',
                    weight: 400,
                },
            ],
        },
    );
}
