import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Code, Star, X, FileCode, Link as LinkIcon, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ProjectsTab = ({ userData }) => {
  const [projects, setProjects] = useState([]);
  // Removed saved projects functionality
  const [selectedTier, setSelectedTier] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);

  useEffect(() => {
    if (userData?.targetRole) {
      fetchProjects(userData.targetRole);
    }
    // Removed saved projects loading
  }, [userData?.targetRole]);

  const fetchProjects = async (targetRole) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/${targetRole}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Removed toggleSaveProject

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'Beginner': return '🟢';
      case 'Intermediate': return '🟡';
      case 'Advanced': return '🔴';
      default: return '⚪';
    }
  };

  const filteredProjects = selectedTier === 'all'
    ? projects
    : projects.filter(project => project.tier === selectedTier);

  const tiers = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Recommended Projects
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Build your portfolio with these hands-on projects tailored to your career goals.
        </p>
      </div>

      {/* Tier Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tiers.map((tier) => (
          <button
            key={tier}
            onClick={() => setSelectedTier(tier)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedTier === tier
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {tier === 'all' ? 'All Projects' : `${getTierIcon(tier)} ${tier}`}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-lg group"
          >
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTierColor(project.tier)}`}>
                    {getTierIcon(project.tier)} {project.tier}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                  {project.title}
                </h3>
              </div>
              {/* Save button removed */}
            </div>

            {/* Project Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {project.description}
            </p>

            {/* Skills */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Covered:</h4>
              <div className="flex flex-wrap gap-1">
                {project.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Meta */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{project.estimatedTime}</span>
              </div>
              {/* Solo project indicator removed */}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
                onClick={() => {
                  setSelectedProject(project);
                  setExpandedStep(0);
                }}
              >
                <Code className="w-4 h-4" />
                <span>Start Project</span>
              </button>
              {/* View Rubric button removed */}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Saved Projects section removed */}

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Have Any Career Questions?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Discuss your tech upskilling path with our career counsellors on call
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary px-8 py-3 text-lg">
              Request a Callback
            </button>

          </div>
        </div>
      </div>

      {/* Start Project Side Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50">
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-2xl border-l flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b flex items-start justify-between gap-4 shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
                  <p className="text-sm text-gray-600 mt-2 max-w-2xl">{selectedProject.description}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded hover:bg-gray-100"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Skills covered */}
                <div className="p-6 border-b">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Skills Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.skills.map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Interactive Steps */}
                <div className="p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Step-by-step Guide</h3>
                  <div className="space-y-3">
                    {getProjectSteps(selectedProject).map((step, i) => (
                      <div key={i} className="border rounded-lg">
                        <button
                          className="w-full flex items-center justify-between text-left px-4 py-3 hover:bg-gray-50"
                          onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold">{i + 1}</div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{step.title}</div>
                              <div className="text-xs text-gray-600">{step.subtitle}</div>
                            </div>
                          </div>
                          {expandedStep === i ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <AnimatePresence initial={false}>
                          {expandedStep === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-4"
                            >
                              <p className="text-sm text-gray-700 leading-relaxed mb-3">{step.description}</p>
                              {step.code && (
                                <div className="bg-gray-900 text-gray-100 rounded-lg overflow-hidden text-sm">
                                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800 bg-gray-800">
                                    <div className="flex items-center gap-2 text-xs text-gray-300"><FileCode className="w-4 h-4" />{step.language}</div>
                                    {step.link && (
                                      <a className="flex items-center gap-1 text-xs text-primary-300 hover:text-primary-200" href={step.link} target="_blank" rel="noreferrer">
                                        <LinkIcon className="w-3 h-3" /> Docs
                                      </a>
                                    )}
                                  </div>
                                  <pre className="p-3 overflow-x-auto"><code>{step.code}</code></pre>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Career Counsellor CTA */}
                <div className="p-6 pt-0">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-3">
                     
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Have Any Career Questions?</div>
                        <div className="text-sm text-gray-600">Discuss your tech upskilling path with our career counsellors on call.</div>
                        <div className="text-xs text-gray-500 mt-1">100+ Certified Tech Counsellors</div>
                      </div>
                    </div>
                    <button className="btn-primary px-5 py-2 whitespace-nowrap">Request a Callback</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsTab;

//Helper: produce interactive steps per project (mocked for now)
function getProjectSteps(project) {
  if (/e-?commerce/i.test(project.title)) {
    return [
      { title: 'Scaffold the project', subtitle: 'Client and server setup', description: 'Create a root folder, initialize React frontend and Node/Express backend, install dependencies, configure linting and environment variables.' },
      { title: 'Backend bootstrap', subtitle: 'Express app + MongoDB connection', description: 'Set up Express middlewares, connect to MongoDB, and expose a basic health endpoint.' },
      { title: 'Define data models', subtitle: 'User, Product, Cart', description: 'Design MongoDB schemas for users (with roles), product catalog, and shopping cart with relationships.' },
      { title: 'Authentication', subtitle: 'Register, login, user profile', description: 'Implement bcrypt password hashing and JWT-based authentication with protected routes.' },
      { title: 'Products API', subtitle: 'List, detail, search, pagination', description: 'Create endpoints to list products with filtering, sorting, and pagination, plus a detail endpoint.' },
      { title: 'Cart API', subtitle: 'Add, update, remove, clear', description: 'Provide authenticated endpoints to manage cart items and compute totals.' },
      { title: 'Seed products', subtitle: 'Sample catalog for development', description: 'Add a script to insert sample products for testing and development.' },
      { title: 'Client bootstrap', subtitle: 'Routing and API helper', description: 'Set up React Router, create a central Axios API helper, and prepare basic layout components.' },
      { title: 'Auth UI', subtitle: 'Register, login, session handling', description: 'Build forms and components for registration and login, persist JWT in local storage, and protect private pages.' },
      { title: 'Catalog UI', subtitle: 'Product grid with filters', description: 'Fetch products from API and render a responsive grid with search, filters, sorting, and pagination.' },
      { title: 'Product detail + Add to cart', subtitle: 'Qty selector and actions', description: 'Create a product detail page that displays item info and allows adding to the cart for both guest and authenticated users.' },
      { title: 'Cart page', subtitle: 'Display and manage items', description: 'Show all cart items with ability to update quantities, remove products, and display totals for guest and authed flows.' },
      { title: 'Checkout stub', subtitle: 'Order creation', description: 'Create a minimal order API and page to convert the cart into an order record (payment optional).' },
      { title: 'Testing setup', subtitle: 'API and UI tests', description: 'Add Jest/Supertest for backend and Vitest/React Testing Library for frontend component and integration tests.' },
      { title: 'Security & hardening', subtitle: 'Validation and headers', description: 'Validate inputs, hide sensitive fields, enable security headers, and consider rate limiting on auth endpoints.' },
      { title: 'Deploy', subtitle: 'Production release', description: 'Deploy API to a cloud provider (Render/Fly/Railway) and frontend to Vercel/Netlify with proper environment variables.' },
      { title: 'Stretch goals', subtitle: 'Optional enhancements', description: 'Add features like admin product management, product reviews, wishlists, image uploads, and Stripe test payments.' }
    ];
  }

  if (/(chat|real[\s-]?time)/i.test(project.title)) {
    return [
      { title: 'Scaffold the project', subtitle: 'Monorepo with TypeScript', description: 'Create React + Vite (TS) client and Node (TS) server with shared ESLint/Prettier and environment config.' },
      { title: 'Backend bootstrap', subtitle: 'HTTP + Socket layer', description: 'Stand up Express for REST and Socket.io for real-time events; add health route and namespaces.' },
      { title: 'Redis integration', subtitle: 'Adapter and storage', description: 'Connect Redis for Socket.io pub/sub scaling and message storage base (Streams/Lists/Hashes).' },
      { title: 'Domain models', subtitle: 'Users, Rooms, Messages', description: 'Define types and minimal persistence for users, room metadata, and message entities with attachments.' },
      { title: 'Authentication', subtitle: 'JWT and handshake', description: 'Implement register/login, verify JWT in Socket.io handshake, and authorize room joins.' },
      { title: 'Rooms management', subtitle: 'CRUD and membership', description: 'Expose endpoints to list/create/join/leave rooms; support public/private and basic moderation roles.' },
      { title: 'Messaging events', subtitle: 'Send/receive with acks', description: 'Implement room broadcasting with server acknowledgements, message ids, and timestamps.' },
      { title: 'Message persistence', subtitle: 'Append and retain', description: 'Persist messages per room with retention/trim policies and metadata (author, type, file refs).' },
      { title: 'History & pagination', subtitle: 'Backfill on join', description: 'Provide REST to fetch recent history and paginate older messages; preload after successful join.' },
      { title: 'Presence & typing', subtitle: 'Status signals', description: 'Track online presence and typing indicators via Redis sets and heartbeats with TTLs.' },
      { title: 'File sharing', subtitle: 'Uploads and links', description: 'Add upload endpoint with validation and optional antivirus hook; store metadata and secure URLs.' },
      { title: 'Client routing', subtitle: 'Rooms and chat views', description: 'Add routes for room list, chat view, and settings; gate views behind login.' },
      { title: 'Client socket hooks', subtitle: 'State and reconnection', description: 'Create a Socket.io hook for connection, reconnection, JWT auth, and per-room message state.' },
      { title: 'UI/UX', subtitle: 'Responsive chat layout', description: 'Build message list with virtualization, message composer with attachments, and accessible controls.' },
      { title: 'Offline & reliability', subtitle: 'Queue and retry', description: 'Queue outbound messages offline and retry on reconnect; de-duplicate by client ids.' },
      { title: 'Moderation & limits', subtitle: 'Rate limit and filter', description: 'Apply per-user/room limits, content length caps, soft deletes, and audit logs.' },
      { title: 'Observability', subtitle: 'Logs, metrics, traces', description: 'Emit structured logs, message rate metrics, and traces; build dashboards and alerts.' },
      { title: 'Testing', subtitle: 'Unit, integration, e2e', description: 'Test auth, room joins, messaging flows, history pagination, and negative cases.' },
      { title: 'Security hardening', subtitle: 'Headers and validation', description: 'Validate inputs, sanitize filenames, enforce CORS, and rotate secrets across environments.' },
      { title: 'Deploy', subtitle: 'Scale with Redis', description: 'Run multiple server replicas with Socket.io Redis adapter; use CDN/object storage for files.' },
      { title: 'Stretch goals', subtitle: 'Reactions, threads, notifications', description: 'Add reactions, edits, threads, read receipts, and push notifications for mentions/DMs.' }
    ];
  }

  
  if (/(micro[-\s]?services?|msa)/i.test(project.title)) {
    return [
      { title: 'Define scope & domains', subtitle: 'Bounded contexts', description: 'Identify services from business domains; map dependencies and data ownership boundaries.' },
      { title: 'Service contracts', subtitle: 'APIs and events', description: 'Specify REST/GraphQL schemas and async event models; define versioning, errors, and idempotency.' },
      { title: 'Repo strategy', subtitle: 'Mono vs polyrepo', description: 'Choose code layout, shared libraries policy, and release strategy with clear CI ownership.' },
      { title: 'Container baseline', subtitle: 'Docker images', description: 'Create minimal base images with health checks, config via env, and non-root users.' },
      { title: 'Local orchestration', subtitle: 'Docker Compose', description: 'Bring up core services, backing stores, and dev tools for fast iteration.' },
      { title: 'Service discovery', subtitle: 'DNS / registry', description: 'Use platform DNS/registry for name-based discovery and consistent service addressing.' },
      { title: 'Synchronous comms', subtitle: 'REST/GraphQL', description: 'Implement idempotent endpoints, timeouts, retries with backoff, and circuit breakers.' },
      { title: 'Asynchronous comms', subtitle: 'Events & queues', description: 'Adopt Kafka/NATS/Rabbit; define topics, schemas, keys, partitions, and retention policies.' },
      { title: 'Data per service', subtitle: 'Independent persistence', description: 'Use separate databases; avoid cross-service joins; adopt outbox/inbox for consistency.' },
      { title: 'API Gateway', subtitle: 'Edge routing', description: 'Introduce gateway for routing, authN/Z, rate limits, and request/response shaping.' },
      { title: 'Kubernetes foundation', subtitle: 'Manifests/Helm', description: 'Create Deployments, Services, Ingress, ConfigMaps/Secrets, and autoscaling policies.' },
      { title: 'Service Mesh', subtitle: 'mTLS & traffic', description: 'Install Istio/Linkerd for mTLS, retries, timeouts, traffic shifting, and telemetry.' },
      { title: 'Observability', subtitle: 'Logs/metrics/traces', description: 'Standardize JSON logs, Prometheus metrics, and OpenTelemetry traces with dashboards and alerts.' },
      { title: 'Central config', subtitle: '12-factor', description: 'Externalize configs, feature flags, and per-env overrides with reload signals and auditable changes.' },
      { title: 'Resilience testing', subtitle: 'Chaos drills', description: 'Inject latency and failures; verify bulkheads, timeouts, degradation paths, and fallbacks.' },
      { title: 'Security baseline', subtitle: 'mTLS/JWT/OPA', description: 'Enforce mTLS in mesh, propagate JWT across services, and use policy-as-code for authorization.' },
      { title: 'Rate limiting & quotas', subtitle: 'Per key/route', description: 'Apply gateway/mesh limits, set burst handling, and document 429 semantics for clients.' },
      { title: 'Blue/green & canary', subtitle: 'Progressive delivery', description: 'Roll out with traffic splits and metric guards; automate rollback and artifact promotion.' },
      { title: 'Cost & scaling', subtitle: 'HPA/VPA', description: 'Tune requests/limits; autoscale on CPU/RAM/QPS/lag; watch SLO burn rates and cost dashboards.' },
      { title: 'Backup & DR', subtitle: 'Snapshots & runbooks', description: 'Automate backups, test restores, define RPO/RTO, and document failover procedures.' },
      { title: 'Compliance & auditing', subtitle: 'Traceability', description: 'Log security events, maintain data lineage, and implement retention and access reviews.' },
      { title: 'Postmortems & SLOs', subtitle: 'Operate & improve', description: 'Define SLI/SLOs, on-call runbooks, and blameless postmortems with action tracking.' }
    ];
  }

  // 🟡 Intermediate — API Gateway & Authentication
  if (/(api\s*gateway|auth(entication)?)/i.test(project.title)) {
    return [
      { title: 'Requirements & threat model', subtitle: 'Scope & risks', description: 'List routes, clients, auth flows, and attack surfaces; define SLAs and success metrics.' },
      { title: 'Gateway selection', subtitle: 'Express/Nginx/Kong', description: 'Choose gateway platform and plugin approach based on needs, team skills, and ops model.' },
      { title: 'Routing & upstreams', subtitle: 'Path/host rules', description: 'Configure route matching, upstream pools, active health checks, timeouts, and retries.' },
      { title: 'Request validation', subtitle: 'Schema-first', description: 'Validate methods, headers, and bodies against OpenAPI/JSON Schema with consistent error shapes.' },
      { title: 'JWT authentication', subtitle: 'Issuer & keys', description: 'Verify tokens using JWKS; handle expiration, audience, and clock skew; cache key sets safely.' },
      { title: 'OAuth flows', subtitle: 'Auth Code + PKCE', description: 'Integrate with an IdP; support refresh tokens, token introspection, and revocation endpoints.' },
      { title: 'Authorization model', subtitle: 'RBAC/ABAC', description: 'Map roles/claims to routes and methods; externalize policies for auditability and change control.' },
      { title: 'Rate limiting', subtitle: 'Global & per client', description: 'Enforce quotas and bursts using Redis or gateway plugins; provide standard 429 responses.' },
      { title: 'API design', subtitle: 'Consistency rules', description: 'Standardize status codes, error format, idempotency keys, pagination, and correlation IDs.' },
      { title: 'Observability', subtitle: 'Access logs & metrics', description: 'Emit structured logs and latency histograms; build per-route dashboards and SLO alerts.' },
      { title: 'Security headers', subtitle: 'Best practices', description: 'Set HSTS, CSP (as applicable), CORP/CORPP, and strict CORS policies with preflight caching.' },
      { title: 'Secrets & keys', subtitle: 'Rotation & storage', description: 'Store secrets in a vault; rotate keys; pin JWKS with caching and exponential backoff.' },
      { title: 'Testing strategy', subtitle: 'Unit/integration/e2e', description: 'Test token verification, policy decisions, rate limits, and negative/security cases.' },
      { title: 'Staging & canary', subtitle: 'Safe rollout', description: 'Validate in staging, canary in production, monitor error budgets, and automate rollback.' },
      { title: 'Documentation & SDKs', subtitle: 'Dev experience', description: 'Publish OpenAPI, quickstarts, and lightweight client helpers for common stacks.' },
      { title: 'Operations & runbooks', subtitle: 'On-call ready', description: 'Produce dashboards, incident runbooks, access review procedures, and regular drills.' }
    ];
  }
// Project 1 of DevOps and Cloud Computing
  if (/(infrastructure\s*as\s*code|iac|terraform)/i.test(project.title)) {
    return [
      { title: 'Define scope', subtitle: 'Targets and regions', description: 'Choose AWS services to provision (VPC, subnets, EC2, RDS, S3). Pick regions and naming standards.' },
      { title: 'Repo & workflow', subtitle: 'Git + environments', description: 'Create Git repo with dev/stage/prod dirs or workspaces. Add PR flow and branch protections.' },
      { title: 'Terraform baseline', subtitle: 'Providers & backends', description: 'Pin provider versions. Configure remote state backend and state locking. Enable workspaces.' },
      { title: 'Variables & outputs', subtitle: 'Parametrize infra', description: 'Define input variables with defaults and validation. Expose outputs for consumers and CI.' },
      { title: 'Core networking', subtitle: 'VPC & subnets', description: 'Provision VPC, public/private subnets, route tables, IGW/NAT, and security groups with tags.' },
      { title: 'Compute layer', subtitle: 'EC2/ASG or ECS', description: 'Create compute with user-data bootstrap. Attach IAM roles and least-privileged policies.' },
      { title: 'Stateful services', subtitle: 'RDS or DynamoDB', description: 'Provision database with parameter groups, backups, and subnet groups in private subnets.' },
      { title: 'Storage & logs', subtitle: 'S3 + CloudWatch', description: 'Add S3 buckets with encryption and lifecycle rules. Configure log groups and retention.' },
      { title: 'Modules', subtitle: 'Reusable components', description: 'Factor VPC, compute, and DB into modules. Document inputs/outputs and version them.' },
      { title: 'Docker integration', subtitle: 'Images for apps', description: 'Dockerize sample app and push to a registry for later deployment onto provisioned compute.' },
      { title: 'Policy & security', subtitle: 'Guardrails', description: 'Enable encryption at rest/in-transit, restrict SG ingress, and add basic IAM boundaries.' },
      { title: 'CI for Terraform', subtitle: 'Plan & apply', description: 'Set up pipeline that runs fmt/validate/plan on PR and apply on protected branches.' },
      { title: 'Documentation', subtitle: 'Runbooks & diagrams', description: 'Record architecture diagram, variables table, and state recovery steps.' }
    ];
  }

   // 🟡 Intermediate — CI/CD Pipeline
   if (/(ci\/?cd|pipeline|jenkins|gitlab\s*ci)/i.test(project.title)) {
    return [
      { title: 'Objectives', subtitle: 'Quality gates & environments', description: 'Define triggers, stages, environments, and success criteria (coverage, lint, DAST/SAST).' },
      { title: 'Repo readiness', subtitle: 'Branching & versioning', description: 'Adopt trunk or GitFlow. Decide on semantic versioning and tagging conventions.' },
      { title: 'Build system', subtitle: 'Containerized builds', description: 'Standardize Dockerfile and build context. Cache dependencies to speed up builds.' },
      { title: 'Unit tests', subtitle: 'Automated on each commit', description: 'Run tests with coverage thresholds. Fail fast and publish reports as artifacts.' },
      { title: 'Static analysis', subtitle: 'Lint & SAST', description: 'Add linters and SAST scanners. Enforce on PR with clear annotations and severity gates.' },
      { title: 'Artifact management', subtitle: 'Registry & retention', description: 'Push versioned images to a container registry. Define retention and immutability.' },
      { title: 'Integration tests', subtitle: 'Ephemeral envs', description: 'Spin test environment via Docker Compose or KinD. Run API and contract tests.' },
      { title: 'Deploy staging', subtitle: 'Auto on main', description: 'Deploy to staging cluster or VM. Apply migrations and smoke tests post-deploy.' },
      { title: 'E2E tests', subtitle: 'UI/API checks', description: 'Run end-to-end tests against staging. Gate promotion on pass rate and error budgets.' },
      { title: 'Prod rollout', subtitle: 'Canary/blue-green', description: 'Progressively deploy with health checks, automated rollback, and change audit.' },
      { title: 'Observability', subtitle: 'Logs/metrics/traces', description: 'Publish pipeline metrics, deployment durations, and failure causes to dashboards.' },
      { title: 'Security & secrets', subtitle: 'Vault & policies', description: 'Use secret manager for creds. Rotate tokens. Enforce least privilege for runners.' },
      { title: 'Documentation', subtitle: 'Playbooks', description: 'Provide runbooks for failed builds, rollbacks, and incident communication.' }
    ];
  }

  // 🔴 Advanced — Multi-Cloud Kubernetes Cluster
  if (/(multi[-\s]?cloud.*kubernetes|multi.*k8s)/i.test(project.title)) {
    return [
      { title: 'Scope & topology', subtitle: 'Regions and providers', description: 'Pick AWS and Azure regions. Decide hub-spoke or mesh topology and network ranges.' },
      { title: 'Landing zones', subtitle: 'Accounts & policies', description: 'Create cloud accounts/subscriptions with guardrails, budgets, and IAM/AAD roles.' },
      { title: 'Cluster provisioning', subtitle: 'Terraform AKS/EKS', description: 'Use Terraform to create AKS and EKS with node pools, autoscaling, and network settings.' },
      { title: 'Networking', subtitle: 'CNI & connectivity', description: 'Choose CNI (Azure CNI/Amazon VPC CNI). Set peering/VPN/Transit Gateway for cross-cloud.' },
      { title: 'Identity', subtitle: 'Workload identity', description: 'Configure OIDC/IAM roles for service accounts and Azure workload identity for secretless access.' },
      { title: 'Helm baseline', subtitle: 'Core add-ons', description: 'Deploy Ingress controller, cert-manager, external-dns, CSI drivers, and metrics-server via Helm.' },
      { title: 'Service Mesh', subtitle: 'mTLS & traffic policy', description: 'Install Istio/Linkerd on both clusters. Enable mTLS, retries, timeouts, and traffic shifting.' },
      { title: 'Global traffic', subtitle: 'DNS/GSLB', description: 'Configure DNS failover/geo-routing with health checks to route to healthy clusters.' },
      { title: 'Observability', subtitle: 'Monitoring & tracing', description: 'Install Prometheus/Grafana, Loki, and OpenTelemetry collectors. Unify dashboards across clouds.' },
      { title: 'Security', subtitle: 'OPA & image policy', description: 'Apply Gatekeeper/Kyverno policies, image signing/verification, and CIS benchmarks.' },
      { title: 'Secrets', subtitle: 'External stores', description: 'Integrate External Secrets with AWS Secrets Manager and Azure Key Vault per cluster.' },
      { title: 'Workload deployment', subtitle: 'Helm charts', description: 'Package apps as charts with values per cloud. Use overlays for provider-specific configs.' },
      { title: 'Disaster recovery', subtitle: 'Backup & restore', description: 'Enable Velero for backups, test restores, and document RPO/RTO and runbooks.' },
      { title: 'Cost & scaling', subtitle: 'HPA/VPA & rightsizing', description: 'Tune requests/limits, enable autoscaling, and monitor cost per namespace/workload.' },
      { title: 'Resilience drills', subtitle: 'Game days', description: 'Simulate region loss and mesh failures. Verify failover, SLOs, and rollback paths.' },
      { title: 'Documentation', subtitle: 'Operations & access', description: 'Record network maps, access controls, deployment playbooks, and escalation paths.' }
    ];
  }

  // Generic fallback
  return [
    { title: 'Initialize repository', subtitle: 'Setup project', description: 'Scaffold application, install dependencies, and configure formatting and linting.' },
    { title: 'Implement core feature', subtitle: 'Build main workflow', description: 'Develop the primary user flow and integrate frontend, backend, and database as required.' },
    { title: 'Polish and deploy', subtitle: 'Testing and deployment', description: 'Add tests, improve UI/UX, and deploy to your chosen platform.' }
  ];
}

