/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export enum PSAPIKey {
  'PrivateStateToken' = 'private-state-token',
  'Topics' = 'topics',
  'ProtectedAudience' = 'protected-audience',
  'AttributionReporting' = 'attribution-reporting',
  'FirstPartySets' = 'first-party-sets',
  'SharedStorage' = 'shared-storage',
  'CHIPS' = 'chips',
  'FencedFrames' = 'fenced-frames',
  'FEDCM' = 'fedcm',
  'BounceTracking' = 'bounce-tracking',
  'UserAgentReduction' = 'user-agent-reduction',
}

export type PSAPIKeyType = (typeof PSAPIKey)[keyof typeof PSAPIKey];
