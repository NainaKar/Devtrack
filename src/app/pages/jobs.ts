import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TrackerService } from '../services/tracker.service';
import { JobApplication, JobStatus } from '../models';
import { COMPANY_GROUPS, ROLES } from '../data/roles.data';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="jobs-page">
      <!-- Header Section -->
      <section class="hd rv" style="--i:1">
        <div>
          <h1>Target Companies &amp; Job Tracker</h1>
          <p>Track applications, interview rounds, and skill alignments for target companies.</p>
        </div>
        <button type="button" class="btn p" (click)="showAddModal.set(true)">
          + Add Target Company
        </button>
      </section>

      <!-- Filter & Search Toolbar Card -->
      <div class="card rv filter-card" style="--i:2">
        <div class="filter-row">
          <div class="filter-controls">
            <div class="search-wrap">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="search"
                placeholder="Search company or role..."
                [(ngModel)]="searchQuery"
              />
            </div>

            <select [(ngModel)]="statusFilter" aria-label="Filter by status">
              <option value="ALL">All Statuses ({{ allJobs().length }})</option>
              @for (s of statuses; track s) {
                <option [value]="s">{{ s }}</option>
              }
            </select>
          </div>

          <div class="sub">
            Showing <b>{{ filteredJobs().length }}</b> of {{ allJobs().length }} opportunities
          </div>
        </div>
      </div>

      <!-- Job Applications Table Container -->
      <div class="card rv table-card" style="--i:3; padding:0; overflow:hidden">
        <div class="table-scroll">
          <table class="jobs-table">
            <thead>
              <tr>
                <th>Company &amp; Role</th>
                <th>Status</th>
                <th>Required Skills</th>
                <th>Timeline</th>
                <th>Notes &amp; Next Action</th>
                <th style="text-align:right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (j of filteredJobs(); track j.id) {
                <tr class="job-row">
                  <td>
                    <strong class="company-name">{{ j.company }}</strong>
                    <div class="sub">{{ j.role }}</div>
                    @if (j.postingUrl) {
                      <a class="lnk sub" [href]="j.postingUrl" target="_blank" rel="noopener noreferrer" style="margin-top:2px; display:inline-block">
                        Posting link ↗
                      </a>
                    }
                  </td>
                  <td>
                    <div class="status-cell">
                      <select
                        class="status-select"
                        [ngModel]="j.status"
                        (ngModelChange)="t.updateJob(j.id, { status: $event })"
                        [attr.aria-label]="'Status for ' + j.company"
                      >
                        @for (s of statuses; track s) {
                          <option [value]="s">{{ s }}</option>
                        }
                      </select>
                      <span class="chip" [class.green]="j.status === 'Offer' || j.status === 'Interview'">
                        {{ j.status }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="skills-wrap">
                      @for (sk of j.requiredSkills; track sk) {
                        <span class="chip" style="font-size:11px; padding:2px 8px">{{ sk }}</span>
                      }
                      @if (!j.requiredSkills.length) {
                        <span class="sub">—</span>
                      }
                    </div>
                  </td>
                  <td>
                    @if (j.appliedDate) {
                      <div class="sub">Applied: <b>{{ j.appliedDate | date:'mediumDate' }}</b></div>
                    }
                    @if (j.interviewDate) {
                      <div class="sub" style="color:var(--db-ac); font-weight:600">
                        Interview: {{ j.interviewDate | date:'mediumDate' }}
                      </div>
                    }
                    @if (!j.appliedDate && !j.interviewDate) {
                      <span class="sub">Not scheduled</span>
                    }
                  </td>
                  <td>
                    <div class="sub notes-box">
                      {{ j.notes || 'No notes added yet.' }}
                    </div>
                  </td>
                  <td style="text-align:right">
                    <button
                      type="button"
                      class="btn g btn-sm delete-btn"
                      (click)="t.removeJob(j.id)"
                      title="Remove company"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="empty-state">
                    No target companies found matching your filters. Click "+ Add Target Company" above.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Target Company Modal -->
      @if (showAddModal()) {
        <div class="modal-backdrop">
          <div class="card rv modal-card" style="--i:0">
            <div class="row between" style="margin-bottom:16px">
              <h2>Add Target Company</h2>
              <button type="button" class="btn g btn-sm" (click)="showAddModal.set(false)">✕</button>
            </div>

            <form (ngSubmit)="saveJob()">
              <div class="form-group">
                <label for="companyName">Company Name *</label>
                <input
                  id="companyName"
                  type="text"
                  list="jobCompanies"
                  [(ngModel)]="newCompany"
                  name="newCompany"
                  required
                  placeholder="e.g. Google, TCS, Zoho, or custom startup"
                >
                <datalist id="jobCompanies">
                  @for (cg of companyGroups; track cg.group) {
                    @for (c of cg.companies; track c) {
                      <option [value]="c">{{ cg.group }}</option>
                    }
                  }
                </datalist>
              </div>

              <div class="form-group">
                <label for="jobRole">Target Role *</label>
                <input
                  id="jobRole"
                  type="text"
                  list="jobRoles"
                  [(ngModel)]="newRole"
                  name="newRole"
                  required
                  placeholder="e.g. Angular Developer, SDE, Data Engineer"
                >
                <datalist id="jobRoles">
                  @for (r of roles; track r.id) {
                    <option [value]="r.name"></option>
                  }
                </datalist>
              </div>

              <div class="form-group">
                <label for="postingUrl">Job Posting Link (Optional)</label>
                <input id="postingUrl" type="url" [(ngModel)]="newUrl" name="newUrl" placeholder="https://careers.example.com/job/123">
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label for="initialStatus">Status</label>
                  <select id="initialStatus" [(ngModel)]="newStatus" name="newStatus">
                    @for (s of statuses; track s) {
                      <option [value]="s">{{ s }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label for="appliedDate">Applied Date (Optional)</label>
                  <input id="appliedDate" type="date" [(ngModel)]="newAppliedDate" name="newAppliedDate">
                </div>
              </div>

              <div class="form-group">
                <label for="requiredSkills">Key Skills (comma-separated)</label>
                <input id="requiredSkills" type="text" [(ngModel)]="newSkills" name="newSkills" placeholder="Angular, TypeScript, System Design">
              </div>

              <div class="form-group">
                <label for="notes">Notes &amp; Next Action</label>
                <textarea id="notes" rows="2" [(ngModel)]="newNotes" name="newNotes" placeholder="Referral from alumni, review leetcode medium..."></textarea>
              </div>

              <div class="row modal-actions">
                <button type="button" class="btn g" (click)="showAddModal.set(false)">Cancel</button>
                <button type="submit" class="btn p" [disabled]="!newCompany.trim() || !newRole.trim()">Save Target</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .hd {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 20px;
      flex-wrap: wrap;
      margin: 10px 0 24px;
    }

    .hd h1 {
      font-size: clamp(30px, 3.5vw, 46px);
      line-height: 1.1;
      font-family: var(--db-fd);
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--db-ink);
    }

    .hd p {
      color: var(--db-mu);
      margin: 6px 0 0;
      font-size: 15px;
    }

    .filter-card {
      padding: 14px 20px;
      margin-bottom: 20px;
    }

    .filter-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .filter-controls {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-wrap {
      position: relative;
      display: flex;
      align-items: center;
      min-width: 240px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      width: 16px;
      height: 16px;
      color: var(--db-mu);
      pointer-events: none;
    }

    .search-wrap input {
      padding-left: 36px !important;
      border-radius: 99px !important;
    }

    .table-card {
      border: 1px solid var(--db-ln);
      border-top: 3px solid var(--db-ac);
    }

    .table-scroll {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .jobs-table {
      width: 100%;
      min-width: 680px;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }

    .jobs-table th {
      padding: 14px 18px;
      background: var(--db-bg);
      color: var(--db-mu);
      font-family: var(--db-fb);
      font-weight: 600;
      font-size: 12px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border-bottom: 1px solid var(--db-ln);
    }

    .jobs-table td {
      padding: 14px 18px;
      border-bottom: 1px solid var(--db-ln);
      vertical-align: middle;
      color: var(--db-ink);
    }

    .job-row:hover td {
      background: rgba(255, 255, 255, 0.4);
    }

    .company-name {
      font-size: 15px;
      color: var(--db-ink);
    }

    .status-cell {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: flex-start;
    }

    .status-select {
      padding: 4px 8px !important;
      font-size: 12px !important;
    }

    .skills-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      max-width: 240px;
    }

    .notes-box {
      max-width: 260px;
      line-height: 1.4;
    }

    .delete-btn {
      color: #c4452a;
    }

    .empty-state {
      text-align: center;
      padding: 48px;
      color: var(--db-mu);
    }

    /* Modal Backdrop & Card */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(63, 31, 18, 0.5);
      backdrop-filter: blur(4px);
      z-index: 100;
      display: grid;
      place-items: center;
      padding: 16px;
    }

    .modal-card {
      width: min(520px, 100%);
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 24px 50px rgba(63, 31, 18, 0.35);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 14px;
    }

    .form-group label {
      font-size: 13px;
      font-weight: 600;
      color: var(--db-ink);
    }

    .form-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .modal-actions {
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    @media (max-width: 600px) {
      .hd {
        flex-direction: column;
        align-items: flex-start;
        gap: 14px;
        margin: 4px 0 18px;
      }
      .hd .btn {
        width: 100%;
        text-align: center;
      }
      .form-grid-2 {
        grid-template-columns: 1fr;
      }
      .filter-controls {
        width: 100%;
      }
      .filter-controls select {
        width: 100%;
      }
      .search-wrap {
        width: 100%;
      }
      .modal-card {
        padding: 18px;
      }
      .modal-actions {
        flex-direction: column-reverse;
      }
      .modal-actions button {
        width: 100%;
        min-height: 44px;
      }
    }
  `],
})
export class JobsPage {
  t = inject(TrackerService);
  allJobs = this.t.jobs;

  statuses: JobStatus[] = [
    'Interested',
    'Preparing',
    'Applied',
    'Assessment',
    'Interview',
    'Offer',
    'Rejected'
  ];

  roles = ROLES;
  companyGroups = COMPANY_GROUPS;

  searchQuery = '';
  statusFilter = 'ALL';
  showAddModal = signal(false);

  newCompany = '';
  newRole = '';
  newUrl = '';
  newStatus: JobStatus = 'Preparing';
  newAppliedDate = '';
  newSkills = '';
  newNotes = '';

  filteredJobs = computed(() => {
    const list = this.allJobs();
    const q = this.searchQuery.trim().toLowerCase();
    const sf = this.statusFilter;

    return list.filter(j => {
      const matchSearch =
        !q ||
        j.company.toLowerCase().includes(q) ||
        j.role.toLowerCase().includes(q);
      const matchStatus = sf === 'ALL' || j.status === sf;
      return matchSearch && matchStatus;
    });
  });

  saveJob() {
    if (!this.newCompany.trim() || !this.newRole.trim()) return;

    const skills = this.newSkills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    this.t.addJob({
      company: this.newCompany.trim(),
      role: this.newRole.trim(),
      postingUrl: this.newUrl.trim() || undefined,
      status: this.newStatus,
      appliedDate: this.newAppliedDate || undefined,
      requiredSkills: skills,
      notes: this.newNotes.trim() || undefined,
    });

    this.newCompany = '';
    this.newRole = '';
    this.newUrl = '';
    this.newStatus = 'Preparing';
    this.newAppliedDate = '';
    this.newSkills = '';
    this.newNotes = '';
    this.showAddModal.set(false);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const card = target?.closest?.('.card') as HTMLElement;
    if (card) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    }
  }
}
