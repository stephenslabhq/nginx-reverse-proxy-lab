# Nginx Reverse Proxy

## 1. Project Overview

This project focuses on implementing Nginx as a reverse proxy for multiple backend applications.

The solution will provide a central entry point for client requests, routing traffic to the appropriate application while keeping backend services isolated from direct external access.

The implementation will cover reverse proxy configuration, application communication, TLS termination, security, logging and operational validation.

Development will begin locally using Docker and Docker Compose, with a subsequent deployment to AWS using Terraform.

## 2. Objectives

The project aims to demonstrate:

- Reverse proxy configuration and path-based request routing.
- Communication between Nginx and multiple backend applications.
- Containerisation and service orchestration using Docker Compose.
- Private networking between application services.
- HTTPS and TLS termination.
- Security hardening and access control.
- Logging, troubleshooting and service health validation.
- Infrastructure provisioning using Terraform.
- Deployment and operational considerations in AWS.

## 3. Functional Requirements

The solution should:

1. Accept incoming client requests through Nginx.
2. Route requests to the appropriate backend application based on URL paths.
3. Support a web application and a separate API service.
4. Forward requests and relevant headers to backend services.
5. Provide HTTPS access through Nginx.
6. Allow backend services to communicate privately without requiring direct host port exposure.
7. Provide appropriate behaviour when a backend service becomes unavailable.
8. Expose sufficient logging to investigate request and proxy behaviour.

## 4. Technical Scope

### Reverse Proxy

- Nginx will act as the central entry point.
- Requests will be routed using path-based rules.
- Proxy headers and upstream communication will be configured appropriately.

### Backend Applications

The initial implementation will use:

- Node.js for the web application.
- Python FastAPI for the API service.

Both applications will run independently in containers.

### Containerisation

- Docker will be used to package the applications.
- Docker Compose will manage the local services.
- Backend services will communicate over a private Docker network.
- Only Nginx will publish ports to the host.

### Security

- Configure HTTPS and TLS termination at Nginx.
- Apply appropriate HTTP security headers.
- Restrict unnecessary service exposure.
- Protect certificates, private keys and sensitive configuration.
- Apply sensible container and application security practices.

### Operations and Observability

- Configure Nginx access and error logging.
- Validate application availability and request routing.
- Investigate proxy and upstream communication failures.
- Evaluate service health and failure behaviour.

### Cloud Deployment

- Deploy the solution to AWS.
- Provision infrastructure using Terraform.
- Apply appropriate network controls and IAM permissions.
- Consider monitoring, logging and infrastructure costs.

## 5. Non-Functional Requirements

The solution should prioritise:

- Security: Minimise unnecessary exposure and apply appropriate access controls.
- Maintainability: Keep proxy configuration and application responsibilities clearly separated.
- Reliability: Handle backend availability issues predictably.
- Observability: Provide sufficient logs and health information for troubleshooting.
- Reproducibility: Support consistent local deployment through containerisation.
- Cost awareness: Avoid unnecessary cloud resources and document deployment costs.

## 6. Validation Criteria

The implementation will be evaluated against the following:

- Requests to the homepage reach the Node.js application.
- API requests reach the FastAPI service.
- Nginx routes requests to the intended backend.
- HTTPS connections work as expected.
- Backend services are not directly exposed through published host ports.
- Requests behave appropriately when a backend becomes unavailable.
- Relevant access and error logs are available.
- The AWS infrastructure can be provisioned and removed using Terraform.

## 7. Project Boundaries

The initial implementation will not include a database, authentication platform or complex application functionality.

Additional components will only be introduced where they serve a clear technical or operational purpose.

The project will distinguish between functionality implemented and validated locally and functionality subsequently deployed and validated in AWS.