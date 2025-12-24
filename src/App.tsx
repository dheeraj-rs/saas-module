import { Refine } from '@refinedev/core';
import { DevtoolsPanel, DevtoolsProvider } from '@refinedev/devtools';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import routerProvider, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router';
import dataProvider from '@refinedev/simple-rest';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router';
import './App.css';

// Core Infrastructure
import { queryClient } from './core/api/queryClient';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { UnauthorizedPage } from './shared/pages/UnauthorizedPage';
import { errorLogger } from './shared/services/errorLogger';

// Features
import { TenantProvider } from './features/tenancy';
import { accessControlProvider } from './features/auth';

// Components & Providers
import { ErrorComponent } from './components/refine-ui/layout/error-component';
import { Layout } from './components/refine-ui/layout/layout';
import { Toaster } from './components/refine-ui/notification/toaster';
import { useNotificationProvider } from './components/refine-ui/notification/use-notification-provider';
import { ThemeProvider } from './components/refine-ui/theme/theme-provider';
import { ThemeCustomizationProvider } from './providers/theme-customization-provider';
import { authProvider } from './providers/auth-provider';
import { UserProvider } from './contexts/UserContext';

// Pages
import { Login } from './pages/login';
import { Register } from './pages/register';
import { ForgotPassword } from './pages/forgot-password';
import { Settings } from './pages/settings';
import AllEvents from './pages/events';
import AllOrganizations from './pages/organizations';
import { SettingsIcon, CalendarDays, Building2 } from 'lucide-react';
import { OrganizationLayout } from './pages/organization-dashboard/organization-layout';
import OrganizationDashboard from './pages/organization-dashboard';
import ManageEvents from './pages/organization-dashboard/manage-events';
import Registrations from './pages/organization-dashboard/registrations';
import OrganizationSettings from './pages/organization-dashboard/settings';
import { EventLayout } from './pages/event-dashboard/event-layout';
import EventDashboard from './pages/event-dashboard';
import EventRegistrations from './pages/event-dashboard/registrations';
import EventSettings from './pages/event-dashboard/settings';

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        errorLogger.logError(error, {
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <RefineKbarProvider>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <ThemeCustomizationProvider>
                <UserProvider>
                  <TenantProvider>
                    <DevtoolsProvider>
                      <Refine
                        dataProvider={dataProvider(
                          'https://api.fake-rest.refine.dev'
                        )}
                        notificationProvider={useNotificationProvider()}
                        routerProvider={routerProvider}
                        authProvider={authProvider}
                        accessControlProvider={accessControlProvider}
                        resources={[
                          {
                            name: 'events',
                            list: '/events',
                            meta: {
                              label: 'All Events',
                              icon: <CalendarDays />,
                            },
                          },
                          {
                            name: 'organizations',
                            list: '/organizations',
                            meta: {
                              label: 'All Organizations',
                              icon: <Building2 />,
                            },
                          },
                          {
                            name: 'settings',
                            list: '/settings',
                            meta: {
                              label: 'Settings',
                              icon: <SettingsIcon />,
                            },
                          },
                        ]}
                        options={{
                          syncWithLocation: true,
                          warnWhenUnsavedChanges: true,
                          projectId: 'SkXXGj-Hyflnx-WeWCX7',
                          title: {
                            text: 'Saas Module',
                            icon: (
                              <img
                                src="/logo/cp-logo.png"
                                alt="CP Logo"
                                style={{
                                  height: '40px',
                                  width: 'auto',
                                  objectFit: 'contain',
                                }}
                              />
                            ),
                          },
                        }}
                      >
                        <Routes>
                          {/* Authentication Routes */}
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                          />

                          {/* Unauthorized Route */}
                          <Route
                            path="/unauthorized"
                            element={<UnauthorizedPage />}
                          />

                          {/* Protected Routes */}
                          <Route
                            element={
                              <Layout>
                                <Outlet />
                              </Layout>
                            }
                          >
                            <Route
                              index
                              element={<NavigateToResource resource="events" />}
                            />
                            <Route path="/events">
                              <Route index element={<AllEvents />} />
                            </Route>
                            <Route path="/organizations">
                              <Route index element={<AllOrganizations />} />
                            </Route>
                            <Route path="/settings">
                              <Route index element={<Settings />} />
                            </Route>
                            <Route path="*" element={<ErrorComponent />} />
                          </Route>

                          {/* Organization Dashboard Routes */}
                          <Route
                            path="/organization-dashboard/:orgId"
                            element={
                              <OrganizationLayout>
                                <Outlet />
                              </OrganizationLayout>
                            }
                          >
                            <Route index element={<OrganizationDashboard />} />
                            <Route
                              path="manage-events"
                              element={<ManageEvents />}
                            />
                            <Route
                              path="registrations"
                              element={<Registrations />}
                            />
                            <Route
                              path="settings"
                              element={<OrganizationSettings />}
                            />
                          </Route>

                          {/* Event Dashboard Routes */}
                          <Route
                            path="/event-dashboard/:eventId"
                            element={
                              <EventLayout>
                                <Outlet />
                              </EventLayout>
                            }
                          >
                            <Route index element={<EventDashboard />} />
                            <Route
                              path="registrations"
                              element={<EventRegistrations />}
                            />
                            <Route
                              path="settings"
                              element={<EventSettings />}
                            />
                          </Route>
                        </Routes>

                        <Toaster />
                        <RefineKbar />
                        <UnsavedChangesNotifier />
                        <DocumentTitleHandler />
                      </Refine>
                      <DevtoolsPanel />
                    </DevtoolsProvider>
                  </TenantProvider>
                </UserProvider>
              </ThemeCustomizationProvider>
            </ThemeProvider>
          </RefineKbarProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
