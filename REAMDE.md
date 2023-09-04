# Commands
npm run start
eas build --profile development --platform android
eas update --channel=default

# TODO List



# DB structure
[ENTRY]
-granja -> str
-entrada -> str timestamp
-alarms -> Alarm

[ALARM]
-name -> str
-description -> str
-days -> int
-selected -> boold
-triggers_at -> str timestamp
-notification_id -> str
-completed -> bool
