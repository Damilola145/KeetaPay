// import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// Mock the client for local development
export const base44 = {
  auth: {
    me: async () => ({ id: 'local-user', role: 'admin', name: 'Developer User' }),
    logout: () => {},
    redirectToLogin: () => {},
  },
  entities: {
    PaymentLink: {
      list: async (sort, limit) => {
        const links = JSON.parse(window.localStorage.getItem('base44_payment_links') || '[]');
        return links.sort((a,b) => new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime()).slice(0, limit);
      },
      create: async (payload) => {
        const links = JSON.parse(window.localStorage.getItem('base44_payment_links') || '[]');
        const newLink = { ...payload, id: Math.random().toString(36).substr(2, 9), link_id: payload.link_id || Math.random().toString(36).substr(2, 9), created_date: new Date().toISOString() };
        links.unshift(newLink);
        window.localStorage.setItem('base44_payment_links', JSON.stringify(links));
        return newLink;
      },
      filter: async (query) => {
        const links = JSON.parse(window.localStorage.getItem('base44_payment_links') || '[]');
        return links.filter(link => {
          for (const key in query) {
            if (link[key] !== query[key]) return false;
          }
          return true;
        });
      }
    }
  }
};
