import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from './contexts/appContext';

const GA_TRACKING_ID = 'G-72XG3F8LNJ';
const isProd = process.env.NEXT_PUBLIC_MODE === 'production';
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_URL || '';

export const Analytics = () => {
    const { publication, post, page } = useAppContext();

    useEffect(() => {
        if (!isProd) return;

        // Vérification sécurisée pour `window.gtag`
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('config', GA_TRACKING_ID, {
                transport_url: 'https://ping.hashnode.com',
                first_party_collection: true,
            });
        }

        _sendViewsToHashnodeInternalAnalytics();
        _sendViewsToAdvancedAnalyticsDashboard();
    }, [publication, post, page]); // Ajouter les dépendances nécessaires

    const _sendViewsToHashnodeInternalAnalytics = async () => {
        try {
            const event = {
                event_type: 'pageview',
                time: new Date().getTime(),
                event_properties: {
                    hostname: window.location.hostname,
                    url: window.location.pathname,
                    eventType: 'pageview',
                    publicationId: publication.id,
                    dateAdded: new Date().getTime(),
                    referrer: document.referrer,
                },
            };

            let deviceId = Cookies.get('__amplitudeDeviceID');
            if (!deviceId) {
                deviceId = uuidv4();
                Cookies.set('__amplitudeDeviceID', deviceId, { expires: 365 * 2 });
            }
            event['device_id'] = deviceId;

            await fetch(`${BASE_PATH}/ping/data-event`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ events: [event] }),
            });
        } catch (error) {
            console.error('Error sending views to Hashnode internal analytics:', error);
        }
    };

    const _sendViewsToAdvancedAnalyticsDashboard = () => {
        // Implémenter la logique ici
    };

    return null;
};
