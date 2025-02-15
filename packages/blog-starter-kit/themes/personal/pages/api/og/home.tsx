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
const fontMedium = fetch(new URL('../../../assets/PlusJakartaSans-Medium.ttf', import.meta.url)).then(
    (res) => res.arrayBuffer(),
);
const fontSemiBold = fetch(
    new URL('../../../assets/PlusJakartaSans-SemiBold.ttf', import.meta.url),
).then((res) => res.arrayBuffer());
const fontBold = fetch(new URL('../../../assets/PlusJakartaSans-Bold.ttf', import.meta.url)).then((res) =>
    res.arrayBuffer(),
);
const fontExtraBold = fetch(
    new URL('../../../assets/PlusJakartaSans-ExtraBold.ttf', import.meta.url),
).then((res) => res.arrayBuffer());

// Formatteur pour les nombres (K pour milliers)
const kFormatter = (num: number) => {
    return num > 999 ? `${(num / 1000).toFixed(1)}K` : num;
};

export default async function handler(req: NextRequest) {
    // Charger toutes les polices en parallèle
    const [fontDataRegular, fontDataMedium, fontDataSemiBold, fontDataBold, fontDataExtraBold] =
        await Promise.all([fontRegular, fontMedium, fontSemiBold, fontBold, fontExtraBold]);

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(req.url);
    const ogData = JSON.parse(atob(searchParams.get('og') as string));
    const {
        title: encodedTitle,
        photo: userPhoto,
        logo,
        isTeam,
        domain,
        meta: encodedMeta,
        followers,
        articles,
        favicon,
    } = ogData;

    // Décoder les données
    const title = decodeURIComponent(encodedTitle);
    let meta;
    if (encodedMeta) {
        meta = decodeURIComponent(encodedMeta);
    }

    // Définir les styles et les images
    const bannerBackground = '#f1f5f9';
    const photoUrl = userPhoto || DEFAULT_AVATAR;

    return new ImageResponse(
        (
            <div
                style={{
                    fontFamily: '"Plus Jakarta Sans"',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    padding: '40px',
                    backgroundColor: bannerBackground,
                    borderRadius: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Contenu pour les blogs personnels */}
                {!isTeam && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '90%',
                        }}
                    >
                        {/* Photo de profil */}
                        <div
                            style={{
                                marginRight: '40px',
                                width: '224px',
                                height: '224px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src={resizeImage(photoUrl, { w: 400, h: 400, c: 'face' })}
                                alt="Profile"
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>

                        {/* Informations du blog */}
                        <div style={{ flex: 1 }}>
                            {/* Titre ou logo */}
                            {!logo && title && (
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: '48px',
                                        fontWeight: 'bold',
                                        color: '#000',
                                    }}
                                >
                                    {title}
                                </p>
                            )}
                            {logo && (
                                <img
                                    src={resizeImage(logo, { w: 1000, h: 250, c: 'thumb' })}
                                    alt="Logo"
                                    style={{ width: '75%', marginBottom: '20px' }}
                                />
                            )}

                            {/* Domaine */}
                            <p
                                style={{
                                    margin: '10px 0',
                                    fontSize: '24px',
                                    fontWeight: '600',
                                    color: '#000',
                                    opacity: 0.75,
                                }}
                            >
                                {domain}
                            </p>

                            {/* Description */}
                            {meta && (
                                <p
                                    style={{
                                        margin: '10px 0',
                                        fontSize: '20px',
                                        color: '#000',
                                        opacity: 0.75,
                                    }}
                                >
                                    {meta}
                                </p>
                            )}

                            {/* Statistiques */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '20px',
                                }}
                            >
                                {followers > 0 && (
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: '20px',
                                            color: '#000',
                                            opacity: 0.75,
                                        }}
                                    >
                                        <strong>{kFormatter(followers)}</strong> follower
                                        {followers === 1 ? '' : 's'}
                                    </p>
                                )}
                                {articles > 0 && (
                                    <p
                                        style={{
                                            margin: '0 0 0 20px',
                                            fontSize: '20px',
                                            color: '#000',
                                            opacity: 0.75,
                                        }}
                                    >
                                        <strong>{kFormatter(articles)}</strong> article
                                        {articles === 1 ? '' : 's'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Contenu pour les blogs d'équipe */}
                {isTeam && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '80%',
                        }}
                    >
                        {/* Favicon */}
                        {!logo && favicon && (
                            <div
                                style={{
                                    marginRight: '40px',
                                    width: '224px',
                                    height: '224px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    src={`${favicon}?w=400&h=400&fit=crop&crop=faces&auto=compress`}
                                    alt="Favicon"
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </div>
                        )}

                        {/* Informations du blog */}
                        <div style={{ flex: 1 }}>
                            {/* Titre ou logo */}
                            {!logo && title && (
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: '48px',
                                        fontWeight: 'bold',
                                        color: '#000',
                                    }}
                                >
                                    {title}
                                </p>
                            )}
                            {logo && (
                                <img
                                    src={logo}
                                    alt="Logo"
                                    style={{ width: '50%', marginBottom: '20px' }}
                                />
                            )}

                            {/* Domaine */}
                            <p
                                style={{
                                    margin: '10px 0',
                                    fontSize: '24px',
                                    fontWeight: '600',
                                    color: '#000',
                                    opacity: 0.75,
                                }}
                            >
                                {domain}
                            </p>

                            {/* Description */}
                            {meta && (
                                <p
                                    style={{
                                        margin: '10px 0',
                                        fontSize: '20px',
                                        color: '#000',
                                        opacity: 0.75,
                                    }}
                                >
                                    {meta}
                                </p>
                            )}

                            {/* Statistiques */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '20px',
                                }}
                            >
                                {followers > 0 && (
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: '20px',
                                            color: '#000',
                                            opacity: 0.75,
                                        }}
                                    >
                                        <strong>{kFormatter(followers)}</strong> follower
                                        {followers === 1 ? '' : 's'}
                                    </p>
                                )}
                                {articles > 0 && (
                                    <p
                                        style={{
                                            margin: '0 0 0 20px',
                                            fontSize: '20px',
                                            color: '#000',
                                            opacity: 0.75,
                                        }}
                                    >
                                        <strong>{kFormatter(articles)}</strong> article
                                        {articles === 1 ? '' : 's'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
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
                {
                    name: 'Plus Jakarta Sans',
                    data: fontDataMedium,
                    style: 'normal',
                    weight: 500,
                },
                {
                    name: 'Plus Jakarta Sans',
                    data: fontDataSemiBold,
                    style: 'normal',
                    weight: 600,
                },
                {
                    name: 'Plus Jakarta Sans',
                    data: fontDataBold,
                    style: 'normal',
                    weight: 700,
                },
                {
                    name: 'Plus Jakarta Sans',
                    data: fontDataExtraBold,
                    style: 'normal',
                    weight: 800,
                },
            ],
        },
    );
}
