class UserModel {
  final String id;
  final String email;
  final String fullName;
  final bool isActive;
  final bool isPro;
  final DateTime? subscriptionExpiresAt;
  final DateTime createdAt;

  const UserModel({
    required this.id,
    required this.email,
    required this.fullName,
    required this.isActive,
    required this.isPro,
    this.subscriptionExpiresAt,
    required this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
        id: json['id'] as String,
        email: json['email'] as String,
        fullName: json['full_name'] as String,
        isActive: json['is_active'] as bool,
        isPro: json['is_pro'] as bool? ?? false,
        subscriptionExpiresAt: json['subscription_expires_at'] != null
            ? DateTime.parse(json['subscription_expires_at'] as String)
            : null,
        createdAt: DateTime.parse(json['created_at'] as String),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'email': email,
        'full_name': fullName,
        'is_active': isActive,
        'is_pro': isPro,
        'subscription_expires_at': subscriptionExpiresAt?.toIso8601String(),
        'created_at': createdAt.toIso8601String(),
      };
}
