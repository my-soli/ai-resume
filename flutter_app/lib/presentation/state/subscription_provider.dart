import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import 'package:resume_ai/data/repositories/subscription_repository.dart';
import 'package:resume_ai/presentation/state/auth_provider.dart';

const String kProMonthlyId = 'resume_ai_pro';

// Usage state: how many AI calls used this month
final aiUsageProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  return ref.read(subscriptionRepositoryProvider).getUsage();
});

// Subscription state provider
final subscriptionProvider =
    AsyncNotifierProvider<SubscriptionNotifier, bool>(SubscriptionNotifier.new);

class SubscriptionNotifier extends AsyncNotifier<bool> {
  StreamSubscription<List<PurchaseDetails>>? _purchaseSub;

  @override
  Future<bool> build() async {
    final repo = ref.read(subscriptionRepositoryProvider);
    try {
      final status = await repo.getStatus();
      final isPro = status['is_pro'] as bool? ?? false;
      _listenToPurchases();
      return isPro;
    } catch (_) {
      return false;
    }
  }

  void _listenToPurchases() {
    _purchaseSub?.cancel();
    _purchaseSub = InAppPurchase.instance.purchaseStream.listen(
      _onPurchaseUpdate,
      onError: (_) {},
    );
    ref.onDispose(() => _purchaseSub?.cancel());
  }

  Future<void> _onPurchaseUpdate(List<PurchaseDetails> purchases) async {
    for (final purchase in purchases) {
      if (purchase.status == PurchaseStatus.purchased ||
          purchase.status == PurchaseStatus.restored) {
        await _verifyAndActivate(purchase);
        await InAppPurchase.instance.completePurchase(purchase);
      } else if (purchase.status == PurchaseStatus.error) {
        await InAppPurchase.instance.completePurchase(purchase);
      }
    }
  }

  Future<void> _verifyAndActivate(PurchaseDetails purchase) async {
    try {
      final repo = ref.read(subscriptionRepositoryProvider);
      final result = await repo.verifyPurchase(
        purchase.verificationData.serverVerificationData,
        purchase.productID,
      );
      final isPro = result['is_pro'] as bool? ?? false;
      state = AsyncData(isPro);
      if (isPro) {
        // Refresh user profile so isPro is reflected everywhere
        await ref.read(authStateProvider.notifier).refreshProfile();
        // Invalidate usage cache
        ref.invalidate(aiUsageProvider);
      }
    } catch (_) {}
  }

  Future<bool> purchase() async {
    final available = await InAppPurchase.instance.isAvailable();
    if (!available) return false;

    final response = await InAppPurchase.instance
        .queryProductDetails({kProMonthlyId});
    if (response.productDetails.isEmpty) return false;

    final product = response.productDetails.first;
    final param = PurchaseParam(productDetails: product);
    return InAppPurchase.instance.buyNonConsumable(purchaseParam: param);
  }

  Future<void> restore() async {
    await InAppPurchase.instance.restorePurchases();
  }
}
