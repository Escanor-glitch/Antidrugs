import { useState } from 'react';
import LoginPage from './components/LoginPage';
import Layout, { type Page } from './components/Layout';
import Dashboard from './pages/Dashboard';
import VolunteersPage from './pages/VolunteersPage';
import VolunteerProfile from './pages/VolunteerProfile';
import AchievementsPage from './pages/AchievementsPage';
import EventsPage from './pages/EventsPage';
import EventDetail from './pages/EventDetail';
import AttendancePage from './pages/AttendancePage';
import EvaluationsPage from './pages/EvaluationsPage';
import SectorsPage from './pages/SectorsPage';
import NeighborhoodsPage from './pages/NeighborhoodsPage';
import { type UserRole } from './data';

type AuthState = { loggedIn: false } | { loggedIn: true; role: UserRole; userId: string };

type NavState =
  | { page: 'dashboard' }
  | { page: 'volunteers' }
  | { page: 'volunteer-profile'; volunteerId: string }
  | { page: 'achievements'; volunteerId: string }
  | { page: 'events' }
  | { page: 'event-detail'; eventId: string }
  | { page: 'attendance' }
  | { page: 'evaluations' }
  | { page: 'sectors' }
  | { page: 'neighborhoods' };

export default function App() {
  const [auth, setAuth] = useState<AuthState>({ loggedIn: false });
  const [nav, setNav] = useState<NavState>({ page: 'dashboard' });

  if (!auth.loggedIn) {
    return <LoginPage onLogin={(role, userId) => setAuth({ loggedIn: true, role, userId })} />;
  }

  const navigateTo = (page: Page, extra?: { volunteerId?: string; eventId?: string }) => {
    if (page === 'volunteer-profile' && extra?.volunteerId) {
      setNav({ page: 'volunteer-profile', volunteerId: extra.volunteerId });
    } else if (page === 'event-detail' && extra?.eventId) {
      setNav({ page: 'event-detail', eventId: extra.eventId });
    } else {
      setNav({ page } as NavState);
    }
  };

  const currentPageForLayout: Page = nav.page === 'volunteer-profile' ? 'volunteers'
    : nav.page === 'achievements' ? 'volunteers'
    : nav.page === 'event-detail' ? 'events'
    : nav.page as Page;

  return (
    <Layout
      currentPage={currentPageForLayout}
      onNavigate={page => setNav({ page } as NavState)}
      role={auth.role}
      onLogout={() => setAuth({ loggedIn: false })}
    >
      {nav.page === 'dashboard' && (
        <Dashboard
          onNavigate={page => setNav({ page } as NavState)}
          userId={auth.userId}
          role={auth.role}
        />
      )}
      {nav.page === 'volunteers' && (
        <VolunteersPage
          onViewProfile={id => setNav({ page: 'volunteer-profile', volunteerId: id })}
          userId={auth.userId}
          role={auth.role}
        />
      )}
      {nav.page === 'volunteer-profile' && (
        <VolunteerProfile
          volunteerId={nav.volunteerId}
          onBack={() => setNav({ page: 'volunteers' })}
          onViewAchievements={id => setNav({ page: 'achievements', volunteerId: id })}
          onViewEvent={id => setNav({ page: 'event-detail', eventId: id })}
          userId={auth.userId}
          role={auth.role}
        />
      )}
      {nav.page === 'achievements' && (
        <AchievementsPage
          volunteerId={nav.volunteerId}
          onBack={() => setNav({ page: 'volunteers' })}
          userId={auth.userId}
          role={auth.role}
        />
      )}
      {nav.page === 'events' && (
        <EventsPage
          onViewEvent={id => setNav({ page: 'event-detail', eventId: id })}
        />
      )}
      {nav.page === 'event-detail' && (
        <EventDetail
          eventId={nav.eventId}
          onBack={() => setNav({ page: 'events' })}
          onViewVolunteer={id => setNav({ page: 'volunteer-profile', volunteerId: id })}
        />
      )}
      {nav.page === 'attendance' && (
        <AttendancePage
          userId={auth.userId}
          role={auth.role}
        />
      )}
      {nav.page === 'evaluations' && <EvaluationsPage />}
      {nav.page === 'sectors' && <SectorsPage />}
      {nav.page === 'neighborhoods' && <NeighborhoodsPage />}
    </Layout>
  );
}
