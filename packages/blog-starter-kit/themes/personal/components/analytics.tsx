import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from './contexts/appContext';

const GA_TRACKING_ID = 'G-72XG3F8LNJ'; // This is Hashnode's GA tracking ID
const isProd = process.env.NEXT_PUBLIC_MODE === 'production';
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_URL || '';

export const Analytics = () => {
    const { publication, post, page } = useAppContext();

    const _sendPageViewsToHashnodeGoogleAnalytics = () => {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('config', GA_TRACKING_ID, {
                transport_url: 'https://ping.hashnode.com',
                first_party_collection: true,
            });
        } else {
            console.warn('Google Analytics (gtag) is not available.');
        }
    };

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
                Cookies.set('__amplitudeDeviceID', deviceId, {
                    expires: 365 * 2, // expire after two years
                });
            }
            event['device_id'] = deviceId;

            await fetch(`${BASE_PATH}/ping/data-event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ events: [event] }),
            });
        } catch (error) {
            console.error('Error sending views to Hashnode internal analytics:', error);
        }
    };

    function _sendViewsToAdvancedAnalyticsDashboard() {
        const publicationId = publication?.id;
        const postId = post?.id;
        const staticPageId = page?.id;

        if (!publicationId) {
            console.warn('Publication ID is missing; could not send analytics.');
            return;
        }

        if (typeof window === 'undefined') {
            return;
        }

        const isLocalhost = window.location.hostname === 'localhost';
        if (isLocalhost) {
            console.warn(
                'Analytics API call is skipped because you are running on localhost.',
                { publicationId, postId, staticPageId },
            );
            return;
        }

        const event = {
            payload: {
                publicationId,
                postId: postId || null,
                seriesId: null,
                pageId: staticPageId || null,
                url: window.location.href,
                referrer: document.referrer || null,
                language: navigator.language || null,
                screen: `${window.screen.width}x${window.screen.height}`,
            },
            type: 'pageview',
        };

        const blob = new Blob(
            [
                JSON.stringify({
                    events: [event],
                }),
            ],
            {
                type: 'application/json; charset=UTF-8',
            },
        );

        let hasSentBeacon = false;
        try {
            if (navigator.sendBeacon) {
                hasSentBeacon = navigator.sendBeacon(`${BASE_PATH}/api/analytics`, blob);
            }
        } catch (error) {
            console.error('Error using navigator.sendBeacon:', error);
        }

        if (!hasSentBeacon) {
            fetch(`${BASE_PATH}/api/analytics`, {
                method: 'POST',
                body: blob,
                credentials: 'omit',
                keepalive: true,
            }).catch((error) => {
                console.error('Error sending analytics via fetch:', error);
            });
        }
    }

    useEffect(() => {
        if (!isProd) return;

        _sendPageViewsToHashnodeGoogleAnalytics();
        _sendViewsToHashnodeInternalAnalytics();
        _sendViewsToAdvancedAnalyticsDashboard();
    }, [publication, post, page]); // Ajout des dépendances nécessaires

    return null;
};
