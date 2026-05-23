import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:resume_ai/services/api_client.dart';

final subscriptionRepositoryProvider = Provider<SubscriptionRepository>(
  (ref) => SubscriptionRepository(ref.read(apiClientProvider)),
);

class SubscriptionRepository {
  final ApiClient _client;
  SubscriptionRepository(this._client);

  Future<Map<String, dynamic>> verifyPurchase(
      String purchaseToken, String productId) async {
    final response = await _client.post('/subscriptions/verify', data: {
      'purchase_token': purchaseToken,
      'product_id': productId,
    });
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> getStatus() async {
    final response = await _client.get('/subscriptions/status');
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> getUsage() async {
    final response = await _client.get('/ai/usage');
    return response.data as Map<String, dynamic>;
  }
}
