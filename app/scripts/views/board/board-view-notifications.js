module.exports.markRelatedNotificationsRead = function () {
  for (const notification of this.modelCache.all('Notification')) {
    // If notification is related and unread
    if (
      notification.get('unread') &&
      !notification.get('data')?.card &&
      notification.get('data')?.board?.id === this.model.get('id')
    ) {
      notification.markRead();
    }
  }
};
