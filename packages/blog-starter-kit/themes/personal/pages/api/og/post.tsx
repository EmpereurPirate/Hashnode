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
    const {
        author: authorEncoded,
        isDefaultModeDark,
        readTime,
        comments,
        reactions,
        domain,
        title: encodedTitle,
        bgcolor,
        photo,
    } = ogData;

    const author = decodeURIComponent(authorEncoded);
    const title = decodeURIComponent(encodedTitle);
    const photoUrl = photo ? resizeImage(photo, { w: 64, h: 64, c: 'face' }) : DEFAULT_AVATAR;

    let bannerBackground = bgcolor || (isDefaultModeDark ? '#0f172a' : '#f3f4f6');

    return new ImageResponse(
        (
            <div
                style={{
                    fontFamily: '"Plus Jakarta Sans"',
                    backgroundColor: bannerBackground,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    padding: '40px',
                    color: isDefaultModeDark ? '#fff' : '#1e293b',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '80%',
                        backgroundColor: isDefaultModeDark ? '#000' : '#fff',
                        borderRadius: '16px',
                        padding: '40px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '20px',
                        }}
                    >
                        <img
                            src={photoUrl}
                            alt="Author"
                            style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                marginRight: '16px',
                            }}
                        />
                        <div>
                            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{author}</p>
                            <p style={{ margin: 0, fontSize: '18px', opacity: 0.6 }}>{domain}</p>
                        </div>
                    </div>

                    <p
                        style={{
                            margin: '20px 0',
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}
                    >
                        {title}
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            marginTop: '20px',
                        }}
                    >
                        {reactions && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <svg
                                    fill="#64748b"
                                    style={{
                                        height: '2rem',
                                        width: '2rem',
                                        marginRight: '0.75rem',
                                    }}
                                    viewBox="0 0 512 512"
                                >
                                    <path d="m255.1 96 12-11.98C300.6 51.37 347 36.51 392.6 44.1c68.9 11.48 119.4 71.1 119.4 141v5.8c0 41.5-17.2 81.2-47.6 109.5L283.7 469.1c-7.5 7-17.4 10.9-27.7 10.9s-20.2-3.9-27.7-10.9L47.59 300.4C17.23 272.1 0 232.4 0 190.9v-5.8c0-69.9 50.52-129.52 119.4-141 44.7-7.59 92 7.27 124.6 39.92L255.1 96zm0 45.3-33.7-34.7c-25.3-25.29-61.4-36.83-96.7-30.94-53.49 8.92-93.6 55.24-93.6 109.44v5.8c0 32.7 14.45 63.8 38.32 86.1L250.1 445.7c1.6 1.5 3.7 2.3 5 2.3 3.1 0 5.2-.8 6.8-2.3L442.6 277c23.8-22.3 37.4-53.4 37.4-86.1v-5.8c0-54.2-39.2-100.52-92.7-109.44-36.2-5.89-71.4 5.65-96.7 30.94l-35.5 34.7z" />
                                </svg>
                                <p style={{ margin: 0, fontSize: '1.5rem', opacity: 0.6 }}>{reactions}</p>
                            </div>
                        )}

                        {comments && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <svg
                                    fill="#64748b"
                                    style={{
                                        height: '2rem',
                                        width: '2rem',
                                        marginRight: '0.75rem',
                                    }}
                                    viewBox="0 0 576 512"
                                >
                                    <path d="M569.9 441.1c-.5-.4-22.6-24.2-37.9-54.9 27.5-27.1 44-61.1 44-98.2 0-80-76.5-146.1-176.2-157.9C368.4 72.5 294.3 32 208 32 93.1 32 0 103.6 0 192c0 37 16.5 71 44 98.2-15.3 30.7-37.3 54.5-37.7 54.9-6.3 6.7-8.1 16.5-4.4 25 3.6 8.5 12 14 21.2 14 53.5 0 96.7-20.2 125.2-38.8 9.1 2.1 18.4 3.7 28 4.8 31.5 57.5 105.5 98 191.8 98 20.8 0 40.8-2.4 59.8-6.8 28.5 18.5 71.6 38.8 125.2 38.8 9.2 0 17.5-5.5 21.2-14 3.6-8.5 1.9-18.3-4.4-25zM155.4 314l-13.2-3-11.4 7.4c-20.1 13.1-50.5 28.2-87.7 32.5 27.5-27.1 44-61.1 44-98.2 0-80-76.5-146.1-176.2-157.9C368.4 72.5 294.3 32 208 32 93.1 32 0 103.6 0 192c0 37 16.5 71 44 98.2-15.3 30.7-37.3 54.5-37.7 54.9-6.3 6.7-8.1 16.5-4.4 25 3.6 8.5 12 14 21.2 14 53.5 0 96.7-20.2 125.2-38.8 9.1 2.1 18.4 3.7 28 4.8 31.5 57.5 105.5 98 191.8 98 20.8 0 40.8-2.4 59.8-6.8 28.5 18.5 71.6 38.8 125.2 38.8 9.2 0 17.5-5.5 21.2-14 3.6-8.5 1.9-18.3-4.4-25zM155.4 314l-13.2-3-11.4 7.4c-20.1 13.1-50.5 28.2-87.7 32.5 27.5-27.1 44-61.1 44-98.2 0-80-76.5-146.1-176.2-157.9C368.4 72.5 294.3 32 208 32 93.1 32 0 103.6 0 192c0 37 16.5 71 44 98.2-15.3 30.7-37.3 54.5-37.7 54.9-6.3 6.7-8.1 16.5-4.4 25 3.6 8.5 12 14 21.2 14 53.5 0 96.7-20.2 125.2-38.8 9.1 2.1 18.4 3.7 28 4.8 31.5 57.5 105.5 98 191.8 98 20.8 0 40.8-2.4 59.8-6.8 28.5 18.5 71.6 38.8 125.2 38.8 9.2 0 17.5-5.5 21.2-14 3.6-8.5 1.9-18.3-4.4-25z" />
                                </svg>
                                <p style={{ margin: 0, fontSize: '1.5rem', opacity: 0.6 }}>{comments}</p>
                            </div>
                        )}

                        {readTime && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <svg
                                    fill="#64748b"
                                    style={{
                                        height: '2rem',
                                        width: '2rem',
                                        marginRight: '0.75rem',
                                    }}
                                    viewBox="0 0 576 512"
                                >
                                    <path d="M540.9 56.77c-45.95-16.66-90.23-24.09-129.1-24.75-60.7.94-102.7 17.45-123.8 27.72-21.1-10.27-64.1-26.8-123.2-27.74-40-.05-84.4 8.35-129.7 24.77C14.18 64.33 0 84.41 0 106.7v302.9c0 41.5-17.2 81.2-47.6 109.5L250.1 445.7c1.6 1.5 3.7 2.3 5 2.3 3.1 0 5.2-.8 6.8-2.3L442.6 277c23.8-22.3 37.4-53.4 37.4-86.1v-5.8c0-54.2-39.2-100.52-92.7-109.44-36.2-5.89-71.4 5.65-96.7 30.94l-35.5 34.7z" />
                                </svg>
                                <p style={{ margin: 0, fontSize: '1.5rem', opacity: 0.6 }}>{readTime} min read</p>
                            </div>
                        )}
                    </div>
                </div>
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
