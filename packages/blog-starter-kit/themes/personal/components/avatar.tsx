import Image from 'next/image';
import { resizeImage } from '@starter-kit/utils/image';
import { DEFAULT_AVATAR } from '../utils/const';

type Props = {
    username: string;
    name: string;
    picture: string;
    size: number;
};

export const Avatar = ({ username, name, picture, size }: Props) => {
    // Calcul de la taille de l'image
    const imageSize = size || 32; // Taille par défaut si `size` n'est pas fourni

    return (
        <div className="flex items-center gap-2">
            <a href={`https://hashnode.com/@${username}`} target="_blank" rel="noopener noreferrer">
                <Image
                    src={resizeImage(picture, { w: 160, h: 160, c: 'face' }) || DEFAULT_AVATAR}
                    alt={name}
                    width={imageSize}
                    height={imageSize}
                    className="rounded-full"
                    style={{ objectFit: 'cover' }}
                />
            </a>
            <div className="text-base font-bold text-slate-600 dark:text-neutral-300">
                <a href={`https://hashnode.com/@${username}`} target="_blank" rel="noopener noreferrer">
                    {name}
                </a>
            </div>
        </div>
    );
};
