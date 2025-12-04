// Styles/style.js
import { StyleSheet } from 'react-native';

const colors = {
  background: '#050816',
  surface: '#0b1020',
  card: '#101827',
  primary: '#3b82f6',
  primarySoft: '#1d4ed8',
  accent: '#22c55e',
  text: '#f9fafb',
  subtext: '#9ca3af',
  border: '#1f2933',
  danger: '#ef4444',
};

export default StyleSheet.create({
  // ---------- YLEISTÄ ----------

  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },

  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },

  labelEX: {
    color: colors.subtext,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 15,
  },

  dropdown: {
    marginBottom: 12,
    borderRadius: 12,
    borderColor: colors.border,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },

  primaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },

  // ---------- RADIO / SETTINGS ----------

  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },

  settingsText: {
    color: colors.text,
    fontSize: 16,
  },

  radioText: {
    fontSize: 16,
    color: colors.text,
  },

  // ---------- HISTORY ----------

  statsContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  statsText: {
    color: colors.text,
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '500',
  },

  workoutItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },

  iconContainer: {
    marginRight: 14,
    justifyContent: 'center',
  },

  historyText: {
    color: colors.subtext,
    fontSize: 14,
    marginBottom: 2,
  },

  // ---------- MODAL (kalenteri) ----------

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '90%',
    borderRadius: 16,
    backgroundColor: colors.surface,
    padding: 12,
  },

  modalCloseButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },

  modalCloseText: {
    textAlign: 'center',
    color: colors.text,
    fontWeight: '600',
  },

  // ---------- CHAT ----------

  chatContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },

  chatMessages: {
    flex: 1,
    marginBottom: 8,
  },

  messageRow: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    marginVertical: 4,
  },

  messageUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },

  messageBot: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },

  messageText: {
    color: colors.text,
    fontSize: 14,
  },

  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },

  chatInput: {
    flex: 1,
    color: colors.text,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 15,
  },

  sendButton: {
    marginLeft: 4,
  },

   planContainer: {
    maxHeight: 260,      // ettei vie koko ruutua
    marginBottom: 8,
  },
  planWeekCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  planWeekTitle: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 6,
    fontSize: 14,
  },
  planSessionRow: {
    marginBottom: 4,
  },
  planSessionDay: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 13,
  },
  planSessionFocus: {
    color: colors.subtext,
    fontSize: 12,
  },
  planExerciseText: {
    color: colors.subtext,
    fontSize: 12,
  },
});
