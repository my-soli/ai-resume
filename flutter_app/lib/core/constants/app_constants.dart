import 'package:flutter/foundation.dart';

class AppConstants {
  // Update _prodBaseUrl with your Railway URL before building for release
  static const String _prodBaseUrl =
      'https://YOUR-APP-NAME.up.railway.app/api/v1';
  static const String _devBaseUrl =
      'http://localhost:8000/api/v1'; // USB ADB reverse tunnel

  static const String baseUrl = kReleaseMode ? _prodBaseUrl : _devBaseUrl;

  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';

  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 60);
}
