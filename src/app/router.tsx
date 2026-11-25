import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AccountPage } from '@/pages/AccountPage';
import { BookingPage } from '@/pages/BookingPage';
import { GalleryPage } from '@/pages/GalleryPage';
import { HomePage } from '@/pages/HomePage';
import { MyBookingsPage } from '@/pages/MyBookingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { TermsPage } from '@/pages/TermsPage';
import { RootLayout } from './RootLayout';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'book', element: <BookingPage /> },
          { path: 'gallery', element: <GalleryPage /> },
          { path: 'bookings', element: <MyBookingsPage /> },
          { path: 'account', element: <AccountPage /> },
          { path: 'privacy', element: <PrivacyPage /> },
          { path: 'terms', element: <TermsPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
