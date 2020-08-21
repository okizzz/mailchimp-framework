export default function startCompaign(
  mailchimpMethods,
  mongooseMethods,
  telegramBotMethods,
  async,
  startWriteLog,
) {
  async.waterfall(
    [
      (next) => {
        const exitCode = 1;
        async.retry(
          { times: 5, interval: 3600000 },
          (callback) => {
            mongooseMethods.getData((err, participants) => {
              let participantsMail = [];
              if (err) {
                return callback(err, null);
              }
              if (participants.length == 0 || participants == null) {
                return callback("Participants of null", null);
              }
              participants.forEach(function (participants) {
                participantsMail.push(participants.mail);
              });
              callback(null, participantsMail);
            });
          },
          (err, participantsMail) => {
            if (err) {
              next(err, { exitCode });
            }
            next(null, { participantsMail });
          },
        );
      },
      ({ participantsMail }, next) => {
        const exitCode = 2;
        async.retry(
          { times: 5, interval: 3600000 },
          (callback) => {
            mailchimpMethods.createSegment((err, segment) => {
              if (err) {
                return callback(err, null);
              }
              if (segment.id == null) {
                return callback("Segment id of null", null);
              }
              callback(null, segment.id);
            });
          },
          (err, segmentId) => {
            if (err) {
              next(err, { exitCode });
            }
            next(null, { participantsMail, segmentId });
          },
        );
      },
      ({ participantsMail, segmentId }, next) => {
        const exitCode = 3;
        async.retry(
          { times: 5, interval: 3600000 },
          (callback) => {
            mailchimpMethods.addSegmentMembers(
              participantsMail,
              segmentId,
              (err, addMembersResult) => {
                if (err) {
                  return callback(err, null);
                }
                if (addMembersResult == null) {
                  return callback("Add members result of null", null);
                }
                callback(null, segmentId);
              },
            );
          },
          (err, segmentId) => {
            if (err) {
              next(err, { exitCode });
            }
            next(null, { segmentId });
          },
        );
      },
      ({ segmentId }, next) => {
        const exitCode = 4;
        async.retry(
          { times: 5, interval: 3600000 },
          (callback) => {
            mailchimpMethods.createCompaign(segmentId, (err, compaign) => {
              if (err) {
                return callback(err, null);
              }
              if (compaign == null) {
                return callback("Compaign of null", null);
              }
              callback(null, compaign);
            });
          },
          (err, compaign) => {
            if (err) {
              next(err, { exitCode });
            }
            next(null, { compaign });
          },
        );
      },
      ({ compaign }, next) => {
        const exitCode = 5;
        async.retry(
          { times: 5, interval: 3600000 },
          (callback) => {
            mailchimpMethods.startSendCompaign(
              compaign.id,
              (err, compaignStatus) => {
                if (err) {
                  return callback(err, null);
                }
                if (compaignStatus == null) {
                  return callback("Compaign start falied", null);
                }
                callback(null, compaignStatus);
              },
            );
          },
          (err, compaignStatus) => {
            if (err) {
              next(err, { exitCode });
            }
            next(null, { compaign, compaignStatus });
          },
        );
      },
    ],
    (err, result) => {
      if (err) {
        const { exitCode } = result;
        startWriteLog(err, exitCode, telegramBotMethods);
      } else {
        const { compaign, compaignStatus } = result;
        startWriteLog(
          `Compaign start sucefully, recipients count: ${compaign.recipients.recipient_count}, compaign name: ${compaign.settings.title}, status code: ${compaignStatus.statusCode}.`,
          0,
          telegramBotMethods,
        );
      }
    },
  );
}
