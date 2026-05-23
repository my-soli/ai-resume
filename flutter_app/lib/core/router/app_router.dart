import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:resume_ai/presentation/screens/auth/login_screen.dart';
import 'package:resume_ai/presentation/screens/auth/register_screen.dart';
import 'package:resume_ai/presentation/screens/auth/forgot_password_screen.dart';
import 'package:resume_ai/presentation/screens/auth/reset_password_screen.dart';
import 'package:resume_ai/presentation/screens/dashboard/dashboard_screen.dart';
import 'package:resume_ai/presentation/screens/resume/resume_builder_screen.dart';
import 'package:resume_ai/presentation/screens/resume/resume_detail_screen.dart';
import 'package:resume_ai/presentation/screens/resume/resume_editor_screen.dart';
import 'package:resume_ai/presentation/screens/ai/ai_result_screen.dart';
import 'package:resume_ai/presentation/screens/settings/privacy_policy_screen.dart';
import 'package:resume_ai/presentation/screens/subscription/upgrade_screen.dart';
import 'package:resume_ai/presentation/screens/splash_screen.dart';
import 'package:resume_ai/presentation/state/auth_provider.dart';

class _AuthNotifier extends ChangeNotifier {
  _AuthNotifier(this._ref) {
    _ref.listen<AsyncValue>(authStateProvider, (_, __) => notifyListeners());
  }
  final Ref _ref;
}

final routerProvider = Provider<GoRouter>((ref) {
  final notifier = _AuthNotifier(ref);

  return GoRouter(
    refreshListenable: notifier,
    initialLocation: '/splash',
    redirect: (context, state) {
      final authState = ref.read(authStateProvider);

      if (authState.isLoading) return null;

      final isLoggedIn = authState.value != null;
      final loc = state.matchedLocation;

      if (loc == '/splash') return null;

      const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
      if (!isLoggedIn && !publicRoutes.contains(loc)) return '/login';
      if (isLoggedIn && (loc == '/login' || loc == '/register')) return '/dashboard';
      return null;
    },
    routes: [
      GoRoute(path: '/splash', builder: (_, __) => const SplashScreen()),
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/register', builder: (_, __) => const RegisterScreen()),
      GoRoute(
        path: '/forgot-password',
        builder: (_, __) => const ForgotPasswordScreen(),
      ),
      GoRoute(
        path: '/reset-password',
        builder: (_, state) => ResetPasswordScreen(
          email: state.extra as String? ?? '',
        ),
      ),
      GoRoute(path: '/dashboard', builder: (_, __) => const DashboardScreen()),
      GoRoute(path: '/resume/new', builder: (_, __) => const ResumeBuilderScreen()),
      GoRoute(
        path: '/resume/:id',
        builder: (_, state) =>
            ResumeDetailScreen(resumeId: state.pathParameters['id']!),
      ),
      GoRoute(
        path: '/resume/:id/edit',
        builder: (_, state) =>
            ResumeEditorScreen(resumeId: state.pathParameters['id']!),
      ),
      GoRoute(
        path: '/resume/:id/ai-result',
        builder: (_, state) =>
            AIResultScreen(resumeId: state.pathParameters['id']!),
      ),
      GoRoute(
        path: '/privacy-policy',
        builder: (_, __) => const PrivacyPolicyScreen(),
      ),
      GoRoute(
        path: '/upgrade',
        builder: (_, __) => const UpgradeScreen(),
      ),
    ],
    errorBuilder: (_, state) => Scaffold(
      body: Center(child: Text('Page not found: ${state.error}')),
    ),
  );
});
