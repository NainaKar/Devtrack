import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TrackerService } from '../services/tracker.service';
import { JobApplication, JobStatus } from '../models';

@Component({
  selector: 'app-jobs',
  imports: [FormsModule, DatePipe],
  template: `
  <div class="page">
    <div class="page-head row between">
      <div>
        <h1>Target Companies & Job Tracker</h1>
        <p class="muted" style="margin:0">Track applications, interview rounds, and skill alignments for target companies.</p>
      </div>
      <button class="btn btn-primary" (click)="showAddModal.set(true)">+ Add Target Company</button>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="card" style="padding:14px 18px; margin-bottom:18px">
      <div class="row between">
        <div class="row" style="gap:10px">
          <input
            type="search"
            style="width:240px; padding:8px 12px"
            placeholder="Search company or role..."
            [(ngModel)]="searchQuery"
          >
          <select style="width:auto; padding:8px 12px" [(ngModel)]="statusFilter">
            <option value="ALL">All Statuses ({{ allJobs().length }})</option>
            @for (s of statuses; track s) {
              <option [value]="s">{{ s }}</option>
            }
          </select>
        </div>
        <div class="small muted">
          Showing <strong>{{ filteredJobs().length }}</strong> of {{ allJobs().length }} opportunities
        </div>
      </div>
    </div>

    <!-- Job Applications Table -->
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Company & Role</th>
            <th>Status</th>
            <th>Required Skills</th>
            <th>Applied / Interview</th>
            <th>Notes & Next Action</th>
            <th style="text-align:right">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (j of filteredJobs(); track j.id) {
            <tr>
              <td>
                <div style="font-weight:600; color:var(--color-text-primary)">{{ j.company }}</div>
                <div class="small muted">{{ j.role }}</div>
                @if (j.postingUrl) {
                  <a class="small" [href]="j.postingUrl" target="_blank" rel="noopener noreferrer" style="display:inline-block; margin-top:2px">
                    Posting link ↗
                  </a>
                }
              </td>
              <td>
                <select
                  style="width:auto; padding:5px 8px; font-size:0.8rem; border-radius:var(--radius-sm)"
                  [ngModel]="j.status"
                  (ngModelChange)="t.updateJob(j.id, { status: $event })"
                  [attr.aria-label]="'Status for ' + j.company"
                >
                  @for (s of statuses; track s) {
                    <option [value]="s">{{ s }}</option>
                  }
                </select>
                <div style="margin-top:4px">
                  <span class="badge" [class]="t.jobStatusClass(j.status)">{{ j.status }}</span>
                </div>
              </td>
              <td>
                <div style="display:flex; flex-wrap:wrap; gap:4px; max-width:260px">
                  @for (sk of j.requiredSkills; track sk) {
                    <span class="badge gray">{{ sk }}</span>
                  }
                  @if (!j.requiredSkills.length) {
                    <span class="small muted">—</span>
                  }
                </div>
              </td>
              <td>
                @if (j.appliedDate) {
                  <div class="small">Applied: {{ j.appliedDate | date:'mediumDate' }}</div>
                }
                @if (j.interviewDate) {
                  <div class="small" style="color:var(--color-primary); font-weight:600">
                    Interview: {{ j.interviewDate | date:'mediumDate' }}
                  </div>
                }
                @if (!j.appliedDate && !j.interviewDate) {
                  <span class="small muted">Not scheduled</span>
                }
              </td>
              <td>
                <div class="small" style="max-width:240px; color:var(--color-text-secondary)">
                  {{ j.notes || 'No notes added yet.' }}
                </div>
              </td>
              <td style="text-align:right">
                <button
                  class="btn btn-ghost btn-sm"
                  style="color:var(--color-error); border-color:transparent"
                  (click)="t.removeJob(j.id)"
                  title="Remove company"
                >
                  ✕
                </button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6" class="center muted" style="padding:36px">
                No target companies found matching your filters. Click "+ Add Target Company" above.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Quick Add Modal / Drawer -->
    @if (showAddModal()) {
      <div style="position:fixed; inset:0; background:rgba(53,40,32,0.45); backdrop-filter:blur(2px); z-index:100; display:grid; place-items:center; padding:16px">
        <div class="card" style="width:min(520px, 100%); max-height:90vh; overflow-y:auto; box-shadow:var(--shadow-lg)">
          <div class="row between" style="margin-bottom:14px">
            <h3 style="margin:0">Add Target Company</h3>
            <button class="btn btn-ghost btn-sm" (click)="showAddModal.set(false)">✕</button>
          </div>
          <form (ngSubmit)="saveJob()">
            <div class="field">
              <label for="companyName">Company Name *</label>
              <input id="companyName" type="text" [(ngModel)]="newCompany" name="newCompany" required placeholder="e.g. Anthropic, Google, Atlassian">
            </div>
            <div class="field">
              <label for="jobRole">Target Role *</label>
              <input id="jobRole" type="text" [(ngModel)]="newRole" name="newRole" required placeholder="e.g. Frontend Engineer, Full Stack Developer">
            </div>
            <div class="field">
              <label for="postingUrl">Job Posting Link (Optional)</label>
              <input id="postingUrl" type="url" [(ngModel)]="newUrl" name="newUrl" placeholder="https://careers.example.com/job/123">
            </div>
            <div class="grid g2">
              <div class="field">
                <label for="initialStatus">Status</label>
                <select id="initialStatus" [(ngModel)]="newStatus" name="newStatus">
                  @for (s of statuses; track s) {
                    <option [value]="s">{{ s }}</option>
                  }
                </select>
              </div>
              <div class="field">
                <label for="appliedDate">Applied Date (Optional)</label>
                <input id="appliedDate" type="date" [(ngModel)]="newAppliedDate" name="newAppliedDate">
              </div>
            </div>
            <div class="field">
              <label for="requiredSkills">Key Skills (comma-separated)</label>
              <input id="requiredSkills" type="text" [(ngModel)]="newSkills" name="newSkills" placeholder="Angular, TypeScript, System Design">
            </div>
            <div class="field">
              <label for="notes">Notes & Next Action</label>
              <textarea id="notes" rows="2" [(ngModel)]="newNotes" name="newNotes" placeholder="Referral from alumni, review leetcode medium..."></textarea>
            </div>
            <div class="row" style="justify-content:flex-end; margin-top:18px">
              <button type="button" class="btn btn-ghost" (click)="showAddModal.set(false)">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="!newCompany.trim() || !newRole.trim()">Save Target</button>
            </div>
          </form>
        </div>
      </div>
    }
  </div>`,
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
      const matchSearch = !q || j.company.toLowerCase().includes(q) || j.role.toLowerCase().includes(q);
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
}

