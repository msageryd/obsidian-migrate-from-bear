# Onboarding companies and users
#plantrail/onboarding

## Background
We need to monitor newcomers so we can be proactive and minimize churn. As of today we have some tools for this in the form of “admin datasets” in the web app. Better tools are needed.

## Metrics
We will probably need many metrics for following up our onboarding. To keep things simple, each metric should only consist of a single value.

We might be interested in metrics just as information or we might want an alert if the metric is outside of defined limits.

Onboarding scope
We need to monitor companies when they are new to PlanTrail. We also need to monitor individual users which can be newcomers even if the company is not a newcomer anymore.

## Onboarding level
Completely new companies and users need to be monitored closely. As time goes and the company/user proves to be productive in PlanTrail we can loosen the monitoring progressively until the company/user is aPlanTrail professional

- Do we need more than one level?
- What could differ between “total newbie” and “almost on track” in terms of metrics evaluation?
- 

### Company metrics
| metric                       | Value | Warning limits |
|------------------------------|-------|----------------|
| New projects last 30 days    | 3     | <1             |
| Created reports last 30 days | 19    | <1             |
|                              |       |                |
## 

### User account metrics

| metric                             | Value | Warning limits |
|------------------------------------|-------|----------------|
| Days since last login              | 35    | >21            |
| Created controlpoints last 30 days | 5     | <1             |
## 

## 

CREATE TABLE IF NOT EXISTS main.onboaring_level 
(
  id smallint not null,
  name text,
  PRIMARY KEY (id)
);

CREATE TABLE main.onboarding_

INSERT INTO main.onboarding_level
(id, name) 
VALUES 
(1, 'Completely new, monitor metrics closely to minimize churn'),
(2, 'Has proven to '),
(, ''),
(, ''),
(, ''),


ALTER TABLE main.company ADD COLUMN IF NOT EXISTS onboarding_level_id smallint;
ALTER TABLE main.user_account ADD COLUMN IF NOT EXISTS onboarding_level_id smallint;

