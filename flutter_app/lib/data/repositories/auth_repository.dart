import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:resume_ai/core/constants/app_constants.dart';
import 'package:resume_ai/data/models/user_model.dart';
import 'package:resume_ai/services/api_client.dart';

final authRepositoryProvider = Provider<AuthRepository>(
  (ref) => AuthRepository(ref.read(apiClientProvider)),
);

class AuthRepository {
  final ApiClient _client;
  final _storage = const FlutterSecureStorage();

  AuthRepository(this._client);

  Future<String> login(String email, String password) async {
    final response = await _client.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    final data = response.data as Map<String, dynamic>;
    await _saveTokens(data['access_token'], data['refresh_token']);
    return data['access_token'];
  }

  Future<String> register(
      String email, String password, String fullName) async {
    final response = await _client.post('/auth/register', data: {
      'email': email,
      'password': password,
      'full_name': fullName,
    });
    final data = response.data as Map<String, dynamic>;
    await _saveTokens(data['access_token'], data['refresh_token']);
    return data['access_token'];
  }

  Future<void> logout() async {
    await _storage.deleteAll();
  }

  Future<void> forgotPassword(String email) async {
    await _client.post('/auth/forgot-password', data: {'email': email});
  }

  Future<void> resetPassword(
      String email, String code, String newPassword) async {
    await _client.post('/auth/reset-password', data: {
      'email': email,
      'code': code,
      'new_password': newPassword,
    });
  }

  Future<bool> isLoggedIn() async {
    final token = await _storage.read(key: AppConstants.accessTokenKey);
    return token != null;
  }

  Future<UserModel> getProfile() async {
    final response = await _client.get('/users/me');
    return UserModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> _saveTokens(String accessToken, String refreshToken) async {
    await _storage.write(key: AppConstants.accessTokenKey, value: accessToken);
    await _storage.write(
        key: AppConstants.refreshTokenKey, value: refreshToken);
  }
}
