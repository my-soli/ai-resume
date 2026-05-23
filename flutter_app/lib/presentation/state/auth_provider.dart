import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:resume_ai/data/models/user_model.dart';
import 'package:resume_ai/data/repositories/auth_repository.dart';

final authStateProvider =
    AsyncNotifierProvider<AuthNotifier, UserModel?>(AuthNotifier.new);

class AuthNotifier extends AsyncNotifier<UserModel?> {
  @override
  Future<UserModel?> build() async {
    final repo = ref.read(authRepositoryProvider);
    final loggedIn = await repo.isLoggedIn();
    if (!loggedIn) return null;
    try {
      return await repo.getProfile();
    } catch (_) {
      return null;
    }
  }

  Future<void> login(String email, String password) async {
    state = const AsyncLoading();
    try {
      final repo = ref.read(authRepositoryProvider);
      await repo.login(email, password);
      final user = await repo.getProfile();
      state = AsyncData(user);
    } catch (e, st) {
      state = const AsyncData(null); // keep on login page
      Error.throwWithStackTrace(e, st); // re-throw so UI can catch it
    }
  }

  Future<void> register(
      String email, String password, String fullName) async {
    state = const AsyncLoading();
    try {
      final repo = ref.read(authRepositoryProvider);
      await repo.register(email, password, fullName);
      final user = await repo.getProfile();
      state = AsyncData(user);
    } catch (e, st) {
      state = const AsyncData(null);
      Error.throwWithStackTrace(e, st);
    }
  }

  Future<void> refreshProfile() async {
    try {
      final user = await ref.read(authRepositoryProvider).getProfile();
      state = AsyncData(user);
    } catch (_) {}
  }

  Future<void> logout() async {
    await ref.read(authRepositoryProvider).logout();
    state = const AsyncData(null);
  }
}
