export interface INotificationRepository {
  fetchAllRecipientEmails(): Promise<string[]>;
}