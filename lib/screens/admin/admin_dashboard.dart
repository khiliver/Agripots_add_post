import 'package:flutter/material.dart';
import '../../widgets/chatbot_widget.dart';
import '../../services/auth_service.dart';
import 'package:provider/provider.dart';

class AdminDashboard extends StatelessWidget {
  const AdminDashboard({super.key});

  void _handleUsers(BuildContext context) {
    // Navigate to users screen
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Users management coming soon')),
    );
  }

  void _handleAnalytics(BuildContext context) {
    // Navigate to analytics screen
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Analytics dashboard coming soon')),
    );
  }

  void _handleSettings(BuildContext context) {
    // Navigate to settings screen
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Settings page coming soon')),
    );
  }

  void _handleReports(BuildContext context) {
    // Navigate to reports screen
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Reports section coming soon')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Dashboard'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        elevation: 2,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Logout'),
                  content: const Text('Are you sure you want to logout?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Cancel'),
                    ),
                    TextButton(
                      onPressed: () {
                        authService.signOut();
                        Navigator.pop(context);
                      },
                      child: const Text('Logout'),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.1),
                  spreadRadius: 1,
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.2),
                        spreadRadius: 1,
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Image.asset(
                    'assets/images/logo.png',
                    height: 40,
                  ),
                ),
                const SizedBox(width: 16),
                const Text(
                  'AgriPots',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1B5E20),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: GridView.count(
              crossAxisCount: 2,
              padding: const EdgeInsets.all(16),
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              children: [
                _buildDashboardCard(
                  context,
                  'Users',
                  Icons.people,
                  () => _handleUsers(context),
                ),
                _buildDashboardCard(
                  context,
                  'Analytics',
                  Icons.analytics,
                  () => _handleAnalytics(context),
                ),
                _buildDashboardCard(
                  context,
                  'Settings',
                  Icons.settings,
                  () => _handleSettings(context),
                ),
                _buildDashboardCard(
                  context,
                  'Reports',
                  Icons.report,
                  () => _handleReports(context),
                ),
              ],
            ),
          ),
          const ChatbotWidget(),
        ],
      ),
    );
  }

  Widget _buildDashboardCard(
    BuildContext context,
    String title,
    IconData icon,
    VoidCallback onTap,
  ) {
    return Material(
      elevation: 4,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Theme.of(context).primaryColor.withOpacity(0.1),
                Theme.of(context).primaryColor.withOpacity(0.05),
              ],
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 48,
                color: Theme.of(context).primaryColor,
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).primaryColor,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}