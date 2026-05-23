class AIResultModel {
  final String id;
  final String resumeId;
  final String operation;
  final String resumeText;
  final int atsScore;
  final List<String> improvements;
  final List<String> keywordsUsed;
  final Map<String, dynamic> structuredData;
  final DateTime createdAt;

  const AIResultModel({
    required this.id,
    required this.resumeId,
    required this.operation,
    required this.resumeText,
    required this.atsScore,
    required this.improvements,
    required this.keywordsUsed,
    required this.structuredData,
    required this.createdAt,
  });

  factory AIResultModel.fromJson(Map<String, dynamic> json) => AIResultModel(
        id: json['id'] as String,
        resumeId: json['resume_id'] as String,
        operation: json['operation'] as String,
        resumeText: json['resume_text'] as String,
        atsScore: json['ats_score'] as int,
        improvements: List<String>.from(json['improvements'] ?? []),
        keywordsUsed: List<String>.from(json['keywords_used'] ?? []),
        structuredData:
            Map<String, dynamic>.from(json['structured_data'] ?? {}),
        createdAt: DateTime.parse(json['created_at'] as String),
      );

  String get scoreLabel {
    if (atsScore >= 80) return 'Excellent';
    if (atsScore >= 60) return 'Good';
    if (atsScore >= 40) return 'Fair';
    return 'Needs Work';
  }
}
