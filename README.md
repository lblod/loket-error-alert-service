# The Loket Error Alert Service

Service that is responsible for sending out alerts when errors are inserted in the store.  
Build using the [MU Javascript template](https://github.com/mu-semtech/mu-javascript-template).

## Setup

### In a `mu.semte.ch` stack

Paste the following snip-it in your `docker-compose.yml`:

```yaml
version: '3.4'

services:
  error-alert:
    image: lblod/loket-error-alert-service
```

Paste the following snip-it in your `delta/rules.js`:

```json5
{
  match: {
    predicate: {
      type: 'uri',
      value: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
    },
    object: {
      type: 'uri',
      value:'http://open-services.net/ns/core#Error'
    }
  },
  callback: {
    url: 'http://error-alert/delta',
    method:'POST'
  },
  options: {
    resourceFormat: 'v0.0.1',
    gracePeriod: 1000,
    ignoreFromSelf: true
  }
}
```

> For a deeper look into delta's, [check this out](https://github.com/mu-semtech/delta-notifier).

### Environment variables

These can be added in within the docker declaration.

| Name | Description | Default |
|---|---|---|
| `EMAIL_FROM` | Sender of the emails/alerts. ex: "test@domain.net" | **Required** |
| `EMAIL_TO` | Receiver(s) of the emails/alerts. ex: "test@domain.net,123@domain.com" | **Required** |
| `DEBUG` | Enable extra logging.  | `false or 0` |

### [Optional] Config

You can create a `config.json` to add some extra parameters that are not included as environment variables.

1) extend your `docker-compose.yml` service with a config volume:
```yaml
error-alert:
  volumes:
    - ./config/error-alert/:/config/
```

2) add the `config.json` within `./config/error-alert/`:
```json5
{
  // URI Base to be used at data creation.
  "base": string, // Default: "http://lblod.data.gift"
  "service": {
    // URI Resource identifier of this service
    "uri": string // Default: "http://lblod.data.gift/services/loket-error-alert-service"
  },
  // Candidate service that creates delta's of interest. If non is configured, any service is accepted.
  "creators": [string],
  "email": {
    // Created emails will be placed here.
    "folder": string // Default: "http://data.lblod.info/id/mail-folders/2"
  },
  "graph": {
    // Graph were emails live.
    "email": string // Default: "http://mu.semte.ch/graphs/system/email"
  }
}
```

## API

### Create an Email/Alert for the referenced Error.

> **POST** `/alert`

#### Request

```json
{
  "ref": "http://lblod.data.gift/error/b88cec9a-ae7e-4d0c-9f95-00e8654f1c5f"
}
```

#### Responses

- **200 OK**: email was created.
- **202 Accepted**: request was correct but no email was created, already exists.
- **404 Not Found**: could not find the error.
- **422 Unprocessable Entity**: request body was not correct.
- **500 Server Error**: something unexpected went wrong.

### Create an Email/Alert for the referenced Error.

> **POST** `/delta`

#### Request

```json
[
  { "inserts": [
    {
      "subject": { "type": "uri", "value": "http://mu.semte.ch/errors/e8bc5e21-afd8-4e02-a854-41961cdb99a9" },
      "predicate": { "type": "uri", "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" },
      "object": { "type": "uri", "value": "http://open-services.net/ns/core#Error" }
    }
  ],
    "deletes": []
  }
]
```

#### Responses

- **202 Accepted**: delta was ingested and started processing.
- **500 Server Error**: something unexpected went wrong.

## Model

#### Used Prefixes

> Most prefixes can be explored on [prefix.cc](http://prefix.cc/).

### [Error](http://open-services.net/ns/core#Error)

#### Class `oslc:Error`

#### Properties

| Name  | Predicate | Range | Description |
|---|---|---|---|
| subject | [`dct:subject`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/subject) | `xsd:string` | Service failed, threw the error. |
| message | [`oslc:message`](https://docs.oasis-open-projects.org/oslc-op/core/v3.0/ps01/core-vocab.html#message) | `xsd:string` | Short description of the error. (what functionally went wrong) |
| stacktrace | [`oslc:largePreview`](https://docs.oasis-open-projects.org/oslc-op/core/v3.0/ps01/core-vocab.html#largePreview) | `xsd:string` | Stacktrace of the error. *Optional* |
| references | [`dct:references`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/references) | `xsd:anyURI` | Resource the error is related to. *Optional* |
| created | [`dct:created`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/created) | `xsd:dateTime` | Time the error occurred and was logged. |
| creator | [`dct:creator`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/creator) | `xsd:anyURI` | Service that threw the error. |

### [Email](http://www.semanticdesktop.org/ontologies/2007/03/22/nmo#Email)

#### Class `nmo:Email`

#### Properties

> We mostly follow the same model as defined in the [mail-service](https://github.com/redpencilio/deliver-email-service).

#### Properties: extensions

| Name  | Predicate | Range | Description |
|---|---|---|---|
| references | [`dct:references`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/references) | [`nmo:Email`](http://nomisma.org/ontology.rdf#Email) | Email created for the error. |